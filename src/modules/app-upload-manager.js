import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Service configuration - documenting restrictions and metadata for plugins
const SERVICE_CONFIG = {
  imgbb: {
    label: 'imgbb',
    restrictions: 'Images only, maximum 32 MB per file',
    supportedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
    maxFileSize: 32 * 1024 * 1024, // 32 MB
    singleSelect: true, // Only one service can be used at a time,
    apiLink: "https://api.imgbb.com/" // This is where the api key can be obtained
  },
  internetArchive: {
    label: 'Internet Archive',
    restrictions: 'Not be over 100GB, not contain more than 10,000 files.',
    supportedFormats: null, // All formats supported
    maxFileSize: null,
    singleSelect: true, // Only one service can be used at a time,
    apiLink: "https://archive.org/account/s3.php" // This is where the api key can be obtained
  },
};

const SERVICE_LABELS = {
  imgbb: 'imgbb',
  internetArchive: 'Internet Archive',
};

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
};

function getFileName(filePath) {
  return path.basename(filePath);
}

function getMimeType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

async function readFileBuffer(filePath) {
  return fs.readFile(filePath);
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hmacSha256(key, value, outputEncoding) {
  return crypto.createHmac('sha256', key).update(value).digest(outputEncoding);
}

function getSigningKey(secretKey, dateStamp, regionName, serviceName) {
  const kDate = hmacSha256(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, 'aws4_request');
}

function normalizeHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value]),
  );
}

function buildSignedHeaders(headers) {
  const normalizedHeaders = normalizeHeaders(headers);

  return Object.keys(normalizedHeaders)
    .sort()
    .map((name) => `${name}:${String(normalizedHeaders[name]).trim().replace(/\s+/g, ' ')}`)
    .join('\n');
}

function buildSignedHeaderNames(headers) {
  return Object.keys(normalizeHeaders(headers))
    .sort()
    .join(';');
}

function sanitizeIdentifier(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || `lichen-${Date.now()}`;
}

function createImageResult({ serviceId, filePath, uploadResponse, directUrl, previewUrl }) {
  return {
    id: crypto.randomUUID(),
    serviceId,
    serviceLabel: SERVICE_LABELS[serviceId] ?? serviceId,
    fileName: getFileName(filePath),
    filePath,
    mimeType: getMimeType(filePath),
    directUrl,
    previewUrl: previewUrl ?? directUrl,
    uploadedAt: new Date().toISOString(),
    rawResponse: uploadResponse,
  };
}

async function uploadToImgbb(filePath, settings, signal) {
  const apiKey = settings?.services?.imgbb?.apiKey?.trim();
  if (!apiKey) {
    throw new Error('imgbb API key is missing.');
  }

  const fileName = getFileName(filePath);
  const mimeType = getMimeType(filePath);
  const buffer = await readFileBuffer(filePath);
  const formData = new FormData();
  formData.append('image', new Blob([buffer], { type: mimeType }), fileName);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    body: formData,
    signal,
  });

  const responseText = await response.text();
  const responseBody = (() => {
    try {
      return JSON.parse(responseText);
    } catch {
      return { text: responseText };
    }
  })();

  if (!response.ok || responseBody?.success === false) {
    throw new Error(responseBody?.error?.message ?? 'imgbb upload failed.');
  }

  const directUrl = responseBody?.data?.image?.url
    ?? responseBody?.data?.url
    ?? responseBody?.data?.display_url;

  const previewUrl = responseBody?.data?.url_viewer
    ?? responseBody?.data?.url
    ?? directUrl;

  return createImageResult({
    serviceId: 'imgbb',
    filePath,
    uploadResponse: responseBody,
    directUrl,
    previewUrl,
  });
}

function getMediaType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream';
  
  // Map MIME type to Internet Archive mediatype
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'movies';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || ext === '.pdf') return 'texts';
  
  return 'data';
}

function encodeArchiveMetadataValue(value) {
  return `uri(${encodeURIComponent(String(value))})`;
}

async function uploadToInternetArchive(filePath, settings, signal) {
  const accessKey = settings?.services?.internetArchive?.accessKey?.trim();
  const secretKey = settings?.services?.internetArchive?.secretKey?.trim();
  const identifier = sanitizeIdentifier(settings?.services?.internetArchive?.identifier ?? 'lichen-upload');
  const collection = settings?.services?.internetArchive?.collection?.trim() || 'opensource';

  if (!accessKey || !secretKey) {
    throw new Error('Internet Archive credentials are missing.');
  }

  const fileName = getFileName(filePath);
  const mimeType = getMimeType(filePath);
  const mediaType = getMediaType(filePath);
  const buffer = await readFileBuffer(filePath);
  const host = 's3.us.archive.org';
  const encodedFileName = encodeURIComponent(fileName).replace(/%2F/g, '/');
  const requestPath = `/${identifier}/${encodedFileName}`;

  const headers = {
    'content-type': mimeType,
    'x-archive-auto-make-bucket': '1',
    'x-archive-meta-mediatype': mediaType,
    'x-archive-meta-collection': collection,
    'x-archive-meta-title': encodeArchiveMetadataValue(`Upload: ${fileName}`),
    'x-archive-meta-description': encodeArchiveMetadataValue('File uploaded via Lichen uploader'),
    'Authorization': `LOW ${accessKey}:${secretKey}`,
  };

  const response = await fetch(`https://${host}${requestPath}`, {
    method: 'PUT',
    headers,
    body: buffer,
    signal,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || 'Internet Archive upload failed.');
  }

  const directUrl = `https://archive.org/download/${identifier}/${encodedFileName}`;

  return createImageResult({
    serviceId: 'internetArchive',
    filePath,
    uploadResponse: {
      status: response.status,
      body: 'OK',
    },
    directUrl,
    previewUrl: directUrl,
  });
}

const ADAPTERS = {
  imgbb: {
    id: 'imgbb',
    label: 'imgbb',
    async validateCredentials(settings) {
      return Boolean(settings?.services?.imgbb?.apiKey?.trim());
    },
    upload: uploadToImgbb,
  },
  internetArchive: {
    id: 'internetArchive',
    label: 'Internet Archive',
    async validateCredentials(settings) {
      return Boolean(settings?.services?.internetArchive?.accessKey?.trim() && settings?.services?.internetArchive?.secretKey?.trim());
    },
    upload: uploadToInternetArchive,
  },
};

export function getSupportedServices() {
  return Object.values(ADAPTERS).map((adapter) => ({
    id: adapter.id,
    label: adapter.label,
    ...SERVICE_CONFIG[adapter.id],
  }));
}

export async function validateServiceCredentials(serviceId, settings) {
  const adapter = ADAPTERS[serviceId];
  if (!adapter) {
    throw new Error(`Unsupported service: ${serviceId}`);
  }

  return adapter.validateCredentials(settings);
}

export async function uploadFiles({ filePaths, serviceIds, settings, onProgress, signal }) {
  const results = [];
  const totalTasks = Math.max(filePaths.length * serviceIds.length, 1);
  let completedTasks = 0;

  for (const filePath of filePaths) {
    for (const serviceId of serviceIds) {
      if (signal?.aborted) {
        throw new Error('Upload cancelled.');
      }

      const adapter = ADAPTERS[serviceId];
      if (!adapter) {
        throw new Error(`Unsupported service: ${serviceId}`);
      }

      onProgress?.({
        stage: 'starting',
        serviceId,
        filePath,
        fileName: getFileName(filePath),
        progress: Math.round((completedTasks / totalTasks) * 100),
        completedTasks,
        totalTasks,
      });

      const startedAt = Date.now();

      try {
        const result = await adapter.upload(filePath, settings, signal);
        completedTasks += 1;

        const successRecord = {
          ...result,
          uploadedBy: adapter.label,
          uploadedInMs: Date.now() - startedAt,
          status: 'success',
        };

        results.push(successRecord);

        onProgress?.({
          stage: 'completed',
          serviceId,
          filePath,
          fileName: getFileName(filePath),
          progress: Math.round((completedTasks / totalTasks) * 100),
          completedTasks,
          totalTasks,
          result: successRecord,
        });
      } catch (error) {
        completedTasks += 1;

        const failureRecord = {
          id: crypto.randomUUID(),
          serviceId,
          serviceLabel: adapter.label,
          fileName: getFileName(filePath),
          filePath,
          mimeType: getMimeType(filePath),
          directUrl: '',
          previewUrl: '',
          uploadedAt: new Date().toISOString(),
          uploadedBy: adapter.label,
          uploadedInMs: Date.now() - startedAt,
          status: 'failed',
          error: error?.message ?? 'Upload failed.',
        };

        results.push(failureRecord);

        onProgress?.({
          stage: 'failed',
          serviceId,
          filePath,
          fileName: getFileName(filePath),
          progress: Math.round((completedTasks / totalTasks) * 100),
          completedTasks,
          totalTasks,
          error: failureRecord.error,
          result: failureRecord,
        });
      }
    }
  }

  return results;
}
