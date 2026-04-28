# Internet Archive Metadata
[Metadata](https://en.wikipedia.org/wiki/Metadata) is data about data. In the case of Internet Archive items, the metadata describes the contents of the items. Metadata can include information such as the performance date for a concert, the name of the artist, and a set list for the event.

Metadata is a very important element of items in the Internet Archive. Metadata allows people to locate and view information. Items with little or poor metadata may never be seen and can become lost.

Note that metadata keys must be valid XML tags. Please refer to the XML Naming Rules section [here](https://www.w3schools.com/xml/xml_elements.asp).

All metadata for archive.org items are stored in `<identifier>_meta.xml` and `<identifier>_files.xml`.
The meta.xml file contains all of the item-level metadata for an item (e.g. title, description, creator, etc.).
The files.xml file contains all of the file-level metadata (e.g. track title, checksums, etc.).
While these two files are the canonical sources of metadata for archive.org items, most users will interact with an item's metadata via [the metadata API](https://archive.org/services/docs/api/metadata.html).
For example, [nasa_meta.xml](https://archive.org/download/nasa/nasa_meta.xml) correlates to [/metadata/nasa/metadata](https://archive.org/metadata/nasa/metadata) and [nasa_files.xml](https://archive.org/download/nasa/nasa_files.xml) to [/metadata/nasa/files](https://archive.org/metadata/nasa/files).

This document describes common metadata fields used on archive.org.
Refer to [the metadata API docs](https://archive.org/services/docs/api/metadata.html) for more details on reading and writing metadata to items.

## Archive.org Identifiers

Each item at Internet Archive has an identifier.
An identifier is composed of a unique combination of alphanumeric characters (limited to ASCII), underscores (`_`), dashes (`-`), or periods (`.`).
The first character of an identifier must be alphanumeric (e.g. it cannot start out with an underscore, dash, or period).
The maximum length of an identifier is 100 characters, but we generally recommend that identifiers be between 5 and 80 characters in length.

Identifiers must be unique across the entirety of Internet Archive, not simply unique within a single collection.

We prefer human-readable identifiers where possible, as they are more useful for library patrons. For example, consider using the title and/or creators of the item in your identifier, or some shortened form of them.

Once defined an identifier can not be changed.
It will travel with the item or object and is involved in every manner of accessing or referring to the item.

## Custom Metadata Fields

Internet Archive strives to be metadata agnostic, enabling users to define the metadata format which best suits the needs of their material. In addition to the standard metadata fields listed above you may also define as many custom metadata fields as you require. These metadata fields can be defined ad hoc at item creation or metadata editing time and do not have to be defined in advance.

## Metadata Schema

Below are _meta.xml fields that have special meaning on archive.org.
Jump to: {ref}`Public Metadata Fields <public-metadata-fields>` | {ref}`Internal Only Metadata Fields <internal-only-metadata-fields>`

(public-metadata-fields)=
### Public Metadata Fields
<a name="public-metadata-fields"></a>


#### adaptive_ocr
- **required**: No
- **repeatable**: No
- **label**: Adaptive OCR
- **definition**: Allows deriver to skip a page that would otherwise disrupt OCR
- **accepted values**: true

- **defined by**: uploader
- **edit access**: uploader
- **internal use only**: No

#### addeddate
- **required**: Yes
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA software
- **edit access**: not editable
- **label**: Date Added to Public Search
- **definition**: 2019-12 and later dates: represents time item was added to public search engine.  Earlier dates: Date and time in UTC that the item was created archive.org
- **accepted values**: YYYY-MM-DD HH:MM:SS,YYYY-MM-DD
- **usage notes**: Beginning in December 2019 when item was first added to public search engine. It is added during the first task where the item does not have noindex present in meta.xml. The field is not changed or removed if the item is subsequently removed from public search.   Prior to December 2019, Addeddate was automatically set when the item directory is been created in our file system.   In many cases, the addeddate will be very similar to the publicdate.  However, in some cases we create an item directory with metadata but no media files prior to the media being scanned.  The addeddate reflects when the item was created, regardless of when the media was added to the item.  When the media is added at a later date and a derive.php task is run, the publicdate will be added to the item.
- **example**: 
```
2017-03-28 22:05:46
```



#### aspect_ratio
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Aspect Ratio
- **definition**: Ratio of the pixel width and height of a video stream
- **accepted values**: #:#
- **usage notes**: Standard values for this field are 4:3 and 16:9, but other values are possible.
- **example**: 
```
4:3
```



#### audio_codec
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Audio Codec
- **definition**: Program used to decode audio stream
- **accepted values**: String
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
ac3
```



#### audio_sample_rate
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Audio Sample Rate
- **definition**: Samples per second
- **accepted values**: Whole number
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
48000
```



#### betterpdf
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Better PDF
- **definition**: Indicates that the derive module should create a higher quality PDF derivative (distinguishes text from background better).
- **accepted values**: true
- **usage notes**: This field is either set to the value true, or is not included in meta.xml.    If this field is included after the initial derive is run, user should also run a derive task to create the better quality PDF.
- **example**: 
```
true
```



#### bookreader-defaults
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Bookreader defaults
- **definition**: Indicates whether the bookreader should display one or two pages by default
- **accepted values**: mode/1up,mode/2up,mode/thumb
- **usage notes**: The bookreader defaults to showing books in 2up mode, so this field is generally only used to indicate that an item should be displayed in 1up mode (showing only one page at a time in the bookreader).
- **example**: 
```
mode/1up
```



#### bwocr
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Black and White OCR
- **definition**: Allows deriver to OCR specific pages as B&amp;W if color is causing failure.
- **accepted values**: page number or range, e.g. 001


#### call_number
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Call Number
- **definition**: Contributing library&#39;s local call number
- **accepted values**: string
- **example**: 
```
6675707
```


```
NC 285.1 P9287m
```



#### camera
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **label**: Camera
- **definition**: Camera model used during digitization process
- **accepted values**: String
- **example**: 
```
Canon 5D
```



#### ccnum
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **edit access**: uploader
- **label**: Closed Captioning Number
- **definition**: Indicates which closed captioning file should be used for display and search
- **accepted values**: cc#,asr,ocr,#,
- **usage notes**: Primarily used for TV Archive items. Closed captioning files are stored as [identifier].cc#.txt in the item.  This tag indicates which cc# file to display in item and use for search indexing. 
- **example**: 
```
cc5
```


- **defined by**: uploader

#### closed_captioning
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Closed Captioning
- **definition**: Indicates whether item contains closed captioning files
- **accepted values**: yes,no
- **usage notes**: Field is generally only present when the video has closed captioning.  When captioning is not present, the field may have &#34;no&#34; as the value, or just not be included in meta.xml
- **example**: 
```
yes
```


```
no
```



#### collection
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **label**: Collections
- **definition**: Indicates to the website what collection(s) this item belongs to. 
- **accepted values**: Must be a valid identifier
- **example**: 
```
prelinger
```

- **usage notes**: Required for all items except &#34;fav-username&#34; collections.   Always list the item&#39;s primary collection first in meta.xml; this is the collection the item &#34;belongs&#34; to.  The primary collection often represents the entity that contributed or created the content.  Uploaders can only choose from collections that they have privileges for.  General uploaders with no special privs can only upload to selected &#34;Community&#34; collections or the test_collection. Items in the test_collection are removed from the site after 30 days.  &lt;b&gt;Parent collections:&lt;/b&gt;  If the parent collections of an item&#39;s collections are not already included in the item&#39;s own collection list, they will be automatically added (at the end of the next task on the item).  Here, more specifically, is how that addition takes place:  All of the item&#39;s currently listed collections are considered in turn. For each of them, we trace its ancestry all the way up to the top-level collection (usually a mediatype); in tracing ancestry, we consider only the primary (first-listed) parent collection at each step. If the original item is itself a collection, we include the top-level collection, otherwise we don&#39;t. Any collection we encounter during this traversal of the hierarchy that isn&#39;t already in the item&#39;s collection list gets added to the end of the list.  For example, if the original item starts with collections A and B listed, we find A’s primary parent (call it A-P), that collection’s primary parent (A-P-P), etc., until we hit a mediatype; all of those that aren&#39;t already listed get added, including the mediatype if the item itself is a collection. Then we do the same for B and its primary parent B-P, B-P-P, etc.


#### color
- **required**: No
- **repeatable**: No
- **label**: Color
- **definition**: Indicates whether media is in color or black and white
- **accepted values**: String
- **usage notes**: Most used values are: color, B&amp;W (black and white)  Mostly used for video items, indicates whether video is color or black and white.  Can be used to indicate different kinds of color (e.g. Kodachrome).
- **example**: 
```
color
```


- **defined by**: uploader
- **edit access**: uploader
- **internal use only**: No

#### condition 
- **required**: No
- **repeatable**: No
- **label**: Condition
- **definition**: condition of media
- **accepted values**: Mint,Near Mint,Very Good,Good,Fair,Worn,Poor,Fragile,Incomplete
- **usage notes**: Defines the condition of the media in an item.   In 78s and LPs this indicates the condition of the disc or media file. For sets with multiple discs, use the condition of the lowest grade disc in the set.
- **example**: 
```
Good
```


- **defined by**: uploader
- **edit access**: uploader
- **internal use only**: No

#### condition-visual
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Visual Condition
- **definition**: condition of the artwork or printed materials that accompany a media item
- **accepted values**: Mint,Near Mint,Very Good,Good,Fair,Worn,Poor,Fragile,Incomplete,None,Unknown
- **example**: 
```
Good
```


- **usage notes**: Defines the condition of the artwork or printed materials that accompany the media in an item. In LPs this is used for album covers and sleeves.   &#34;Incomplete&#34; should be used when we know that artwork/printed materials are missing.  &#34;None&#34; should be used when the item has no artwork/printed materials and we know it is not supposed to have any.  &#34;Unknown&#34; should be used when artwork/printed material MAY be missing, but we cannot verify.

#### contributor
- **required**: No
- **repeatable**: No
- **label**: Contributor
- **definition**: The person or organization that provided the physical or digital media.
- **accepted values**: String
- **usage notes**: For physical items that have been digitized, contributor represents the library or other organization that owns the physical item.  For born-digital media, contributor often represents the organization responsible for the distribution of the content (e.g. a radio station or television station).
- **example**: 
```
Robarts - University of Toronto
```


- **defined by**: uploader
- **edit access**: uploader
- **internal use only**: No

#### coverage
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Coverage
- **definition**: Geographic or subject area covered by item
- **accepted values**: String
- **usage notes**: The preferred use of this field is to signify a geographical location that relates to the item. For example, in the TV and radio collections, we use the ISO 3166 location code for the country and state/territory of the station being recorded.
- **example**: 
```
GB-LND
```



#### creator
- **required**: No
- **repeatable**: Yes

- **definition**: The individual(s) or organization that created the media content.
- **usage notes**: For items provided by libraries, the creator is often listed using the Library of Congress Name Authority Headings, http://authorities.loc.gov/  For items from other sources, the creator is often listed as first name and surname.    When an item was created by an organization, such as a government agency or a production company, use the full name of the organization.  This field represents the entity who created the media, not the person who uploaded the media to archive.org (though these may be the same person).  All alphabets supported.
- **example**: 
```
Austen, Jane, 1775-1817
```


```
Ralph Burns
```

- **edit access**: uploader
- **defined by**: uploader
- **label**: Creator
- **internal use only**: No
- **accepted values**: String

#### creator-alt-script
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Creator Alternate Script

- **accepted values**: 

#### date
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Publication Date
- **definition**: Date of publication
- **accepted values**: String
- **usage notes**: We encourage people to use YYYY, YYYY-MM, or YYYY-MM-DD for this field, but sometimes exact dates are not possible to determine.  Other common usages: [YYYY] (brackets) when a date is not certain;  c.a. YYYY (c.a.) when a date is approximate; and [n.d.] when a date is unknown (you may also leave the field blank in this case). If an item has a date range, such as YYYY-YYYY, we currently index only the first date in the range.  Books, movies, and CDs often only have YYYY for a publication date.  Magazines often have YYYY-MM for a publication date.  Concerts and articles often have YYYY-MM-DD publication dates.  Use the most specific verifiable date you have access to.  When the item is a digitial representation of a physical piece of media (e.g. a book, a 78rpm disc, etc.) the publication date should represent the date that the specific physical item was published.  A book may have been written in 1850, and then an edition was republished in 1885.  If the digitized version is the edition republished in 1885, use 1885 as the publication date (not 1850).
- **example**: 
```
1965
```


```
2013-05-25
```


```
[n.d.]
```



#### description
- **required**: Recommended
- **repeatable**: Yes
- **label**: Item Description
- **definition**: Describes the media stored in the item.  
- **accepted values**: String, can contain links, formatting and images in html/css. Currently, with Collections, it can also contain raw Javascript, but we plan to remove this soon.
- **usage notes**: May be about the media content (e.g. a description of the book&#39;s plot), the physical item it represents (e.g. missing or damaged pages in the physical book that was digitized), the creator of the media (e.g. author biographical info that relates to the book), or any other information that may help a user understand the item or its context. All alphabets are supported.
- **example**: 
```
 Cinemascope homage to the city of San Francisco made by amateur filmmaker and inventor Tullio Pellegrini. 
```


- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### external-identifier
- **required**: No
- **repeatable**: Yes
- **internal use only**: No

- **accepted values**: String
- **definition**: URLs or identifiers to outside resources that represent the media
- **usage notes**: External-identifier includes Uniform Resource Names (URNs) for external resources about the media in the item. The field is usually in the form of urn:namespace:identifier.
- **example**: 
```
urn:publisher_catalog_id:88697 03614 2
```


```
urn:pubcat:victor:18890-B
```


```
urn:spotify:album:3jmETApVCjXb3hWTR1IEdH
```


```
urn:asin:0451531396
```


```
acs:epub:urn:uuid:d935586b-72a7-4720-bbb9-72fe75eae0e1
```


```
urn:acs6:blackreconstruc00dubo:epub:38413c16-074b-4fb6-a4dc-25e93e199d5f
```


```
urn:mb_artist_id:6de0f914-3e60-4418-be3b-42e0feb6eb4d
```


```
urn:X-pwacrawlid:AWP5
```

- **edit access**: uploader
- **defined by**: uploader
- **label**: External Identifier

#### firstfiledate
- **required**: No
- **repeatable**: No
- **definition**: Creation date of the earliest file contained in the item
- **accepted values**: YYYYMMDDHHMMSS

- **usage notes**: Primarily used for WARC items
- **example**: 
```
20211103001952
```

- **edit access**: uploader
- **defined by**: IA software
- **label**: First File Date
- **internal use only**: No

#### fixed-ppi
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Fixed PPI
- **definition**: To change the ppi to a specific resolution. Usually lower especially when jp2.zip fails
- **accepted values**: Number


#### frames_per_second
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA software
- **edit access**: uploader
- **label**: Frames Per Second
- **definition**: Frequency at which consecutive images are displayed
- **accepted values**: Number

- **example**: 
```
29.97
```

- **usage notes**: Primarily used for TV Archive items.

#### identifier
- **required**: Yes
- **repeatable**: No
- **label**: Item Identifier
- **definition**: Unique identifier for an item on the archive.org web site. Used in the URL for the item, ie archive.org/details/[identifier].
- **accepted values**: String, minimum length is 5 characters, maximum length is 100 characters, contains only Roman alphabet characters, numbers, periods (.), underscores ( _ ), or dashes ( - ), and first character must be alphanumeric.,,mediatype:account items begin with @ symbol.
- **usage notes**: We encourage the use of human-readable identifiers, rather than opaque strings of numbers or letters.  For most projects we try to keep identifiers below 80 characters in length for the sake of readability.
- **example**: 
```
SanFrancisco1955CinemascopeFilm
```


- **defined by**: uploader
- **edit access**: IA admin
- **internal use only**: No

#### identifier-ark
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: ARK
- **definition**: Archival Resource Key identifier
- **accepted values**: ark:/NAAN/Name
- **usage notes**: ARKs are URLs designed to support long-term access to information objects. We store the ark:/NAAN/Name portion of the URL in meta.xml.  This can be tacked on to any ARK resolver&#39;s domain to resolve the ARK, i.e. http://n2t.net/.  Read about ARKs: http://n2t.net/e/ark_ids.html  ARK specification: http://n2t.net/e/arkspec.txt
- **example**: 
```
ark:/13960/t4rj5fk7h
```



#### identifier-bib
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Local Identifier
- **definition**: Additional local identifiers
- **accepted values**: string
- **usage notes**: Fields for many identifiers exist in the schema, including isbn, issn, oclc, and call_number. The identifier-bib field is used for additional local identifiers that don&#39;t have a place elsewhere in metadata. These identifiers are unique to the institution providing the item.
- **example**: 
```
GLAD-84064318
```



#### isbn
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: ISBN
- **definition**: ISBN-10 or ISBN-13
- **accepted values**: String of 10 or 13 digits.,Final digit can be [0-9] or &#39;X&#39;
- **usage notes**:  https://www.iso.org/standard/65483.html https://www.isbn.org/faqs_general_questions#isbn_faq5
- **example**: 
```
3540212507
```


```
031294716X
```



#### issn
- **required**: No
- **repeatable**: Yes
- **internal use only**: No

- **accepted values**: String of 2 groups of four digits separated by a hyphen. Final digit can be [0-9] or &#39;X&#39;
- **definition**: ISSN
- **usage notes**: ISSNs are identifying numbers for serials. See https://www.issn.org/understanding-the-issn/what-is-an-issn/ for clarification.
- **example**: 
```
2528-7788
```


```
1943-345X
```

- **edit access**: uploader
- **defined by**: uploader
- **label**: ISSN

#### language
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **edit access**: uploader
- **label**: Language
- **definition**: The language the media is written or recorded in.
- **accepted values**: String
- **usage notes**: For items provided by libraries, the language is often provided as a 3 letter MARC language code (e.g. eng), https://www.loc.gov/marc/languages/  For other items, the language is often written out as the full name (e.g. English).  Not all items have a language associated with them (e.g. instrumental music), but when there is written or spoken language we are able to do some sorts of processing better when we know the language.    To skip OCR on an item, set the value to None  When an item contains no OCRable content, you will sometimes see the language set to zxx.  Language is particularly important for text items so that we can do the best job with optical character recognition processing.
- **example**: 
```
eng
```


```
Italian
```


```
None
```

- **defined by**: uploader


#### lastfiledate
- **required**: No
- **repeatable**: No
- **label**: Last File Date
- **definition**: Date of creation of oldest file in the item
- **accepted values**: YYYYMMDDHHMMSS
- **usage notes**: Primarily used for WARC items
- **example**: 
```
20211103003910
```


- **internal use only**: No
- **defined by**: IA software
- **edit access**: uploader

#### lccn
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **edit access**: uploader
- **label**: LCCN
- **definition**: Library of Congress Call Number
- **accepted values**: Whole number
- **usage notes**: https://www.loc.gov/marc/lccn_structure.html
- **example**: 
```
2004045278
```


- **defined by**: uploader

#### licenseurl
- **required**: No
- **repeatable**: No
- **definition**: URL of the selected license
- **accepted values**: URL

- **usage notes**: This link should point to a recognized license, like Creative Commons or GNU.  For other types of rights statements, use the rights field.
- **label**: License URL
- **example**: 
```
http://creativecommons.org/licenses/by-nd/3.0/
```

- **defined by**: uploader
- **edit access**: uploader
- **internal use only**: No

#### marc-insert-only
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Marc Insert Only
- **definition**: restricting the incorporation of MARC-extracted metadata to fields that currently have no value (“insert only” behavior),
- **accepted values**: true
- **usage notes**: there are certain classes of item for which we insert MARC-extracted metadata only where no value currently exists in the item metadata for that field, so that we won’t overwrite any existing metadata. if their items are readily identifiable, the same restriction can be applied to those items.
- **example**: 
```
true
```



#### mediatype
- **required**: Yes
- **repeatable**: No
- **definition**: Mediatype tells us about the main content of the item. It is used to determine how the item is displayed on the web site and may trigger special processing depending on the types of files contained in the item.
- **accepted values**: texts,etree,audio,movies,software,image,data,web,collection,account

- **usage notes**: texts: books, articles, newspapers, magazines, any documents with content that contains text etree: live music concerts, items should only be uploaded for artists with collections in the etree &#34;Live Music Archive&#34; community audio: any item where the main media content is audio files, like FLAC, mp3, WAV, etc.  movies: any item where the main media content is video files, like mpeg, mov, avi, etc. software: any item where the main media content is software intended to be run on a computer or related device such as gaming devices, phones, etc. image: any item where the main media content is image files (but is not a book or other text item), like jpeg, gif, tiff, etc. data: any item where the main content is not media or web pages, such as data sets web: any item where the main content is copies of web pages, usually stored in WARC or ARC format collection: designates the item as a collection that can &#34;contain&#34; other items account: designates the item as being a user account page, can only be set by internal archive systems
- **example**: 
```
movies
```

- **edit access**: IA admin
- **defined by**: uploader
- **label**: Type of Media
- **internal use only**: No

#### notes
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Notes
- **definition**: additional notes about the item
- **accepted values**: String
- **usage notes**: Use the description field to describe the media stored in an item. The notes field is for additional information like condition of othe physical item, technical notes about digitization, or similar.


#### oclc-id
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: OCLC ID
- **definition**: Identifier of same edition in OCLC records
- **accepted values**: String
- **example**: 
```
37432884
```



#### openlibrary
- **required**: Deprecated
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library Identifier
- **definition**: Deprecated. Open Library edition identifier
- **accepted values**: OL#M
- **usage notes**: This field is deprecated. Please use openlibrary_edition.
- **example**: 
```
OL2769393M
```



#### openlibrary_author
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library author
- **definition**: Open Library author
- **accepted values**: OL#A
- **usage notes**: Correlates to the edition page on openlibrary.org. The OL edition page URL is https://openlibrary.org/books/[openlibrary_edition]
- **example**: 
```
OL52922A
```



#### openlibrary_edition
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library edition identifier
- **definition**: Open Library edition identifier
- **accepted values**: OL#M
- **usage notes**: Correlates to the edition page on openlibrary.org. The OL edition page URL is https://openlibrary.org/books/[openlibrary_edition]
- **example**: 
```
OL2769393M
```



#### openlibrary_subject
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library subject
- **definition**: Open Library subject
- **accepted values**: string
- **usage notes**: This field is currently used to supply books for carousels on the openlibrary.org home page. At some point it will also be used to import subjects from the openlibrary_work associated with the item.
- **example**: 
```
openlibrary_staff_picks
```



#### openlibrary_work
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library work identifier
- **definition**: Open Library work identifier
- **accepted values**: OL#W
- **usage notes**: Correlates to the work page on openlibrary.org. The OL work page URL is https://openlibrary.org/works/[openlibrary_edition]
- **example**: 
```
OL675783W
```



#### page-progression
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Page Progression
- **definition**: Determines direction pages will be &#34;turned&#34; in a book
- **accepted values**: lr,rl
- **usage notes**: lr = left to right rl = right to left
- **example**: 
```
rl
```


```
lr
```



#### possible-copyright-status
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Possible Copyright Status
- **definition**: Information relevant to copyright status
- **accepted values**: string
- **usage notes**: Do not use this field for CC license information (see licenseurl).
- **example**: 
```
The Centers for Medicare &amp; Medicaid Services Library is unaware of any copyright restrictions for this item.
```



#### ppi
- **required**: No
- **repeatable**: No
- **definition**: Pixels per inch
- **accepted values**: Positive whole number

- **internal use only**: No
- **usage notes**: Indicates pixels per inch for an image.  The most common use case is Internet Archive digitization centers.  This number is set during the book scanning process.
- **label**: PPI
- **defined by**: uploader
- **example**: 
```
300
```

- **edit access**: uploader

#### publisher
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Publisher
- **definition**: Publisher of the media
- **accepted values**: String
- **example**: 
```
New York : R.R. Bowker Co.
```


- **usage notes**: - Books use publisher - Movies often use production company - Music often uses record label

#### related_collection
- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **label**: Related Collection
- **definition**: Adds links to related collection on a collection&#39;s &#34;About&#34; page
- **accepted values**: Identifier


#### related-external-id
- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Related External Identifier
- **definition**: URLs or identifiers to resources related to the media, but not representing this exact form of the work
- **accepted values**: String
- **usage notes**: Related-external-id includes URNs for media related to the media in the item, but which are not exactly the same.  The primary use of this tag is to list ISBNs, LCCNs, and OCLC numbers for other editions of the same work.  These IDs are used for deduplication purposes in the scanning proces.
- **example**: 
```
urn:isbn:0671038303
```



#### rights
- **required**: No
- **repeatable**: No
- **definition**: Rights statement
- **accepted values**: String

- **internal use only**: No
- **usage notes**: Please see licenseurl for URL-based rights designations, like Creative Commons. For other rights information or statements, use the rights field.
- **label**: Rights
- **edit access**: uploader
- **defined by**: uploader
- **example**: 
```
Permission is granted under the Wikimedia Foundation&#39;s 
```


```
These National Treasury publications may not be reproduced wholly or in part without the express authorisation of the National Treasury in writing unless used for non-profit purposes.
```


#### runtime
- **required**: No
- **repeatable**: Yes
- **definition**: Length of an audio or video item
- **accepted values**: HH:MM:SS,H:MM:SS,MM:SS,M:SS,0:SS

- **internal use only**: No
- **usage notes**: Uploader can set this field, but most often we have determined and set this value during the derive process.  
- **label**: Run Time
- **edit access**: uploader
- **defined by**: IA software
- **example**: 
```
00:15:00
```


```
2:12
```


```
0:23
```


#### scandate
- **required**: No
- **repeatable**: No
- **definition**: The date and time in UTC that the media was captured.
- **label**: Scan Date
- **accepted values**: String
- **example**: 
```
20170329201345
```


- **usage notes**: When an physical item is scanned/digitized, scandate represents the date/time that the digitization occurred.    For web items, scandate represents the date/time the first WARC file in the item was created.  For TV and radio items, scandate represents the begining time of the recording.  Formats: YYYYMMDDHHMMSS YYYYMMDD YYYY YYYY-MM-DD HH:MM:SS
- **internal use only**: No
- **edit access**: uploader
- **defined by**: uploader

#### scanner
- **required**: No
- **repeatable**: No
- **definition**: Machinery used to digitize or collect the media
- **accepted values**: String

- **defined by**: uploader
- **edit access**: uploader
- **label**: Scanner
- **internal use only**: No
- **example**: 
```
scribe2.nj.archive.org
```


```
selenium-101.us.archive.org
```


```
Lasergraphics Scanstation
```


```
ArchiveCD Version 2.1.15
```


```
Internet Archive HTML5 Uploader 1.6.3
```

- **usage notes**: Primarily an internally used field. For digitized texts this represents the individual digitization station (e.g. Scribe 2 in the New Jersey center).    For web items this represents the crawl machine used to gather the data.    For films this represents the film scanner.    For CDs this represents the version of the scanning software used for that CD.   For end-user contriuted items, this represents the software used to upload the item.

#### size
- **required**: No
- **repeatable**: Yes
- **internal use only**: No

- **definition**: Size of physical item digitized
- **usage notes**: This field is used for physical items that have been digitized. It denotes the size of the physical item. It is widely used to indicate the size of the record in our digitization efforts, e.g. 10 for 78s or 12 for vinyl. If no unit is measurement is specified, assume inches.
- **label**: Size
- **accepted values**: Number
- **edit access**: uploader
- **defined by**: uploader
- **example**: 
```
10.0
```


#### sort-by
- **required**: No
- **repeatable**: No
- **internal use only**: No

- **definition**: Allows default collection sort to be changed from the standard Views order
- **usage notes**: This tag only works on items that are collection mediatype, and can only be set by people with privileges for that collection.  Sorting by -downloads is allowed, but would currently be redundant, as that is already the default sort for all collections without this tag.
- **label**: Default Collection Sort
- **accepted values**: addeddate,-addeddate,creatorSorter,-creatorSorter,date,-date,downloads,-downloads,publicdate,-publicdate,reviewdate,-reviewdate,titleSorter,-titleSorter,,
- **edit access**: user admin
- **defined by**: user admin
- **example**: 
```
-date
```


#### sound
- **required**: No
- **repeatable**: No

- **internal use only**: No
- **definition**: Indicates whether media has sound or is silent
- **usage notes**: Most used values are: sound, silent  Mostly used for video items, this field indicates whether the media has related sound or is silent.
- **label**: Sound
- **accepted values**: String
- **edit access**: uploader
- **defined by**: uploader
- **example**: 
```
sound
```


```
silent
```


#### source
- **definition**: Source of media
- **usage notes**: Used to signify where a piece of media originated, or what the physical media was prior to digitization.  - Focused crawl items list the site being crawled in this field.   - Texts digitization centers use the field to denote folios.  - TV uses the field to indicate the signal source.  - Internal audio digitization projects use this field to indicate the format of the original media (CD, LP, 78, etc.).  - External users often use this field to list a URL where the media content originated. - Etree users use it to record the &#34;path&#34; for recording a live concert.
- **required**: No
- **label**: Source

- **repeatable**: No
- **accepted values**: String
- **example**: 
```
folio
```


```
Comcast Cable
```


```
CD
```


```
DPA 4021 &gt; SX-M2 &gt; SD 744T @ 44.1 kHZ/16 bit
```

- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### sponsor
- **definition**: The person or organization that funded the digitization or collection of this media.
- **usage notes**: For physical items (books, film, 78rpm, etc.), this represents the entity that funded the digitization/scanning work.   For born-digital items (TV, Radio, Web, etc.) this represents the entity that funded the collection of the items.
- **required**: No
- **label**: Sponsor

- **repeatable**: No
- **accepted values**: String
- **example**: 
```
Kahle-Austin Foundation
```

- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### subject
- **definition**: Subjects and/or topics covered by the media content
- **required**: No

- **repeatable**: Yes
- **accepted values**: String
- **usage notes**: Books and other media objects from libraries often use Library of Congress Subject Headings, http://id.loc.gov/authorities/subjects.html. Some collections may use their own controlled vocabulary for setting subjects. Many other items use the subject field as more casual &#34;tags.&#34;  All alphabets are supported.
- **example**: 
```
France
```

- **edit access**: uploader
- **defined by**: uploader
- **label**: Subject/Keyword
- **internal use only**: No

#### summary
- **required**: No

- **repeatable**: No
- **accepted values**: String, can contain links, formatting and images in html/css. Currently, with Collections, it can also contain raw Javascript, but we plan to remove this soon.
- **definition**: A summary section that appears on collection pages above the description, entire value appears at the top of the collection tab
- **edit access**: user admin
- **defined by**: user admin
- **label**: Collection summary
- **internal use only**: No
- **example**: 
```
The Universal School Library (USL), is a growing collection of digitized books within the Internet Archive&#39;s larger holdings, made available through controlled digital lending, and curated by a national advisory group of school librarians, librarian educators and researchers.
```

- **usage notes**: This tag only works on items that are collection mediatype, and can only be set by people with privileges for that collection.  Normally collection pages only show the first 2 lines of the collection description field on the Collection tab. Content entered into the summary tag for a collection will show at the top of the Collection tab in place of those 2 lines, can include HTML, and be any length (though we recommend keeping it as brief as possible).

#### title
- **internal use only**: No
- **required**: Recommended
- **label**: Title

- **repeatable**: No
- **accepted values**: String, plain text; no HTML or HTML entities (they&#39;ll be displayed in raw form).
- **edit access**: uploader
- **defined by**: uploader
- **example**: 
```
San Francisco (1955 Cinemascope film)
```

- **definition**: Title of media
- **usage notes**: All alphabets are supported

#### title-alt-script
- **internal use only**: No
- **required**: No
- **label**: Title Alternate Script

- **repeatable**: No
- **accepted values**: text
- **edit access**: uploader
- **defined by**: uploader

#### volume

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Volume
- **definition**: Volume number or name
- **accepted values**: string
- **usage notes**: This field is not overwritten by MARC
- **example**: 
```
15
```


#### year

- **required**: Deprecated
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Year of Publication
- **definition**: Deprecated, use date field
- **accepted values**: YYYY
- **usage notes**: Deprecated, use date field
- **example**: 
```
1996
```


(internal-only-metadata-fields)=
### Internal Only Metadata Fields
<a name="internal-only-metadata-fields"></a>


#### access-restricted
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Access Restricted
- **definition**: Collection contents are restricted access
- **accepted values**: true
- **usage notes**: This tag is only used on items of mediatype collection (it will have no affect on items of any other type). This tag should only be assigned by internal IA admins.
- **example**: 
```
true
```



#### access-restricted-item
- **required**: No
- **repeatable**: No
- **label**: Access Restricted Item
- **definition**: Identifies item that is access-restricted
- **accepted values**: true
- **usage notes**: Only used on items, not collections. Automatically added to items in an access-restricted collection at the end of any task.
- **example**: 
```
true
```


- **defined by**: IA admin
- **edit access**: IA admin
- **internal use only**: Yes

#### admin-collection
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **edit access**: IA admin
- **label**: Admin Collection
- **definition**: Collection will generally be suppressed from public display, e.g. in facets, membership lists on Collection/Details pages, etc.
- **accepted values**: true
- **usage notes**: Only used by internal IA admins
- **example**: 
```
true
```


- **defined by**: IA admin

#### boxid
- **required**: No
- **repeatable**: Yes
- **definition**: Location of physical item in the Physical Archive
- **accepted values**: IA######

- **usage notes**: Boxids always start with the letters IA followed by numbers.  The numbers represent the container, pallet and box that the physical item is stored in.  When there are multiple boxid fields in meta.xml, the first boxid listed represents the physical item that was digitized.  Subsequent boxid fields represent the location of duplicate physical items.
- **example**: 
```
IA158001
```

- **edit access**: IA admin
- **defined by**: IA admin
- **label**: Box ID
- **internal use only**: Yes

#### curation
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Curation
- **definition**: Curation state and notes
- **accepted values**: String
- **usage notes**: Curation  is a compound field with &#34;sub-fields&#34;: curator, date, state, and comment.    - Curator is the email address of the person who added the curation tag.   - Date is the UTC time and date the curation tag was added, in YYYYMMDDHHMMSS format. - State can be: dark, approved, freeze, un-dark or blank - Comment can be a code used by the scanning center team to indicate issues found during QA, or a text string with some other curation comment (e.g. information about why an item was frozen or made dark).  Items uploaded into open collections are generally checked by malware detection software, and the curation field will contain the results of that check.
- **example**: 
```
[curator]lenscriv@archive.org[/curator][date]20160504125613[/date][state]approved[/state][comment]199[/comment]
```


```
[curator]malware@archive.org[/curator][date]20140321085621[/date][comment]checked for malware[/comment]
```



#### foldoutcount
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Fold Out Count
- **definition**: Number of fold outs captured by operator
- **accepted values**: Whole number
- **usage notes**: Fold outs are photographed on machinery other than the Scribe.  This field indicates how many foldouts were captured.  The value may be 0 or higher.
- **example**: 
```
1
```



#### force-update
- **required**: No
- **repeatable**: No
- **definition**: For partner-funded scanned books (no boxid), this allows a MARC record in the item to overwrite metadata fields in meta.xml
- **accepted values**: true

- **usage notes**: When this field is NOT present for partner scanned books (no boxid), metadata from a MARC record will only be used to automatically fill in EMPTY metadata fields in meta.xml, and fields that already have metadata in them will be left as-is. Adding force-update to the item causes MARC to overwrite all fields that can be extracted, regardless of whether they already contain information or not.
- **example**: 
```
true
```

- **edit access**: uploader
- **defined by**: uploader
- **label**: Force Update
- **internal use only**: Yes

#### geo_restricted
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Geo Restricted
- **definition**: Limits access based on ISO-2 Country Code
- **accepted values**: e.g US


#### hidden
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: user admin
- **edit access**: user admin
- **label**: Hidden
- **definition**: Hides collection from top level navigation
- **accepted values**: true
- **usage notes**: This tag only functions on items of mediatype collection.
- **example**: 
```
true
```



#### imagecount
- **required**: No
- **repeatable**: No

- **definition**: Imagecount gives an indication of the size of the content of an item (outside of file size, which is represented in the size field).  Originally used only for books, the field has been repurposed over time to provide similar information for other mediatypes.
- **example**: 
```
230
```

- **accepted values**: Positive whole number
- **usage notes**: Texts: represents number of page images in the item  TV: represents number of seconds of video in the item  Web: represents number of URIs captured in the WARCs in the item  CD: number of images of physical item and accompanying materials
- **label**: Image Count
- **defined by**: IA software
- **edit access**: IA software
- **internal use only**: Yes

#### neverindex
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Never Index
- **definition**: Prevents RePublisher from removing noindex at the end of the texts digitization process.
- **accepted values**: true

- **example**: 
```
true
```

- **usage notes**: Only used on internally digitized texts items. Normally when a text finishes the RePublisher process, the noindex tag is removed and the book is added to the public search engine. The neverindex tag prevents the removal of noindex, so books with nevrindex set to true should not end up in the public search engine.

#### next_item
- **required**: No
- **repeatable**: No
- **label**: Next Item
- **definition**: IA identifier of next item from a recorded feed
- **accepted values**: identifier
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
BBCNEWS_20121204_090000_BBC_News
```


- **defined by**: IA software
- **edit access**: IA admin
- **internal use only**: Yes

#### no_ol_import
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: No OL Import
- **definition**: Keeps books out of open library
- **accepted values**: true


#### noindex
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: uploader
- **edit access**: uploader
- **label**: No Index
- **definition**: Prevents item from being indexed in public archive.org search engine
- **accepted values**: true
- **example**: 
```
true
```


- **usage notes**: While the accepted practice is to have a value of &#34;true&#34; for this tag, the mere presence of the tag in meta.xml will actually cause the same effect regardless of the value used (including empty).  In addition to not being included in the public archive.org search engine, the noindex tag will also cause the item to not be listed in the sitemap.

#### ocr
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: OCR Software
- **definition**: Software package and version used for optical character recognition
- **accepted values**: String
- **usage notes**: Set during derivation process.
- **example**: 
```
ABBYY FineReader 8.0
```



#### operator
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Operator
- **definition**: Email of the person who scanned/captured the media in the item
- **accepted values**: String
- **usage notes**: usually email address. In texts this represents the person who operated the Scribe or other scanning equipment.  In web items this represents the engineer responsible for the crawl.
- **example**: 
```
associate-stephanie-kinsey@archive.org
```



#### previous_item
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Previous Item
- **definition**: IA identifier of previous item from a recorded feed
- **accepted values**: identifier
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
BBCNEWS_20121204_060000_Breakfast
```



#### public-format
- **required**: No
- **repeatable**: Yes
- **definition**: Collection file formats that are available to users in an Access Restricted collection
- **accepted values**: String

- **usage notes**: This tag only affects items of mediatype collection and must be used in conjunction with the access-restricted tag.  This tag should only be assigned by internal IA admins.
- **example**: 
```
Metadata
```

- **edit access**: IA admin
- **defined by**: IA admin
- **label**: Public Formats
- **internal use only**: Yes

#### publicdate
- **required**: Yes
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: not editable
- **label**: Date Archived
- **definition**: The date and time in UTC that the item was created on archive.org.
- **accepted values**: YYYY-MM-DD HH:MM:SS,YYYY-MM-DD

- **example**: 
```
2011-12-25 19:01:43
```

- **usage notes**: Publicdate is automatically set when the first catalog task finishes on that item&#39;s directory.

#### repub_state
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Repub State
- **definition**: Indicates the current state of a scanned book.
- **accepted values**: Whole number
- **example**: 
```
19
```



#### republisher
- **required**: Deprecated
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Republisher
- **definition**: Deprecated. Email of the person who completed republishing the item
- **accepted values**: email address
- **usage notes**: This field is deprecated. 
- **example**: 
```
associate-kiana-fekette@archive.org
```



#### republisher_date
- **required**: No
- **repeatable**: No
- **label**: Republisher Date
- **definition**: Date and time in UTC that the item was created archive.org
- **accepted values**: YYYYMMDDHHMMSS
- **usage notes**: Set by Scribe3 software.
- **example**: 
```
20170801165730
```


- **defined by**: IA software
- **edit access**: IA admin
- **internal use only**: Yes

#### republisher_operator
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Republisher Operator
- **definition**: Email of the person who completed republishing the item
- **accepted values**: email address
- **usage notes**: Set by Scribe3 software.
- **example**: 
```
associate-kiana-fekette@archive.org
```



#### republisher_time
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **definition**: Number of seconds required to republish text
- **usage notes**: Set by Scribe3 software.
- **label**: Republisher Time
- **accepted values**: whole number
- **edit access**: IA software
- **defined by**: IA software
- **example**: 
```
504
```



#### scanfee
- **required**: No
- **repeatable**: No
- **definition**: Scanning fee used during billing process
- **accepted values**: string

- **usage notes**: Set by software based on parameters for each scanning partner
- **example**: 
```
100
```


```
300;10;200
```


```
0;1.45;0
```

- **edit access**: IA admin
- **defined by**: IA software
- **label**: Scan Fee
- **internal use only**: Yes

#### scanningcenter
- **required**: No
- **repeatable**: No
- **definition**: The location where a digital copy of the media item was created
- **usage notes**: Generally used in conjunction with our scanning services, this tag gives the location where an item was digitized, scanned or captured.
- **label**: Scanning Center
- **accepted values**: String
- **example**: 
```
boston
```


- **defined by**: IA software
- **edit access**: IA admin
- **internal use only**: Yes

#### show_related_music_by_track
- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **definition**: Adds related tracks to details page
- **label**: Related Music by Track
- **accepted values**: true
- **edit access**: IA admin
- **defined by**: IA admin


#### source_pixel_height
- **definition**: Pixel height of original video stream
- **usage notes**: Primarily used for TV Archive items.
- **required**: No
- **label**: Source Pixel Height

- **repeatable**: No
- **accepted values**: Whole number
- **example**: 
```
480
```

- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin

#### source_pixel_width
- **definition**: Pixel width of original video stream
- **usage notes**: Primarily used for TV Archive items.
- **required**: No
- **label**: Source Pixel Width

- **repeatable**: No
- **accepted values**: Whole number
- **example**: 
```
704
```

- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin

#### sponsordate
- **internal use only**: Yes
- **usage notes**: Related to digitization work. Usually a date string &#34;YYYYMMDD&#34;, but can contain notes, such as:  &#34;not to be invoiced-past billing period&#34; &#34;Grant ended, item not yet invoiced&#34; &#34;sent20111010&#34;
- **definition**: Billing date for scanned materials
- **required**: No
- **label**: Sponsor Date

- **repeatable**: No
- **accepted values**: String
- **edit access**: IA admin
- **defined by**: IA admin
- **example**: 
```
20100531
```


#### start_localtime

- **repeatable**: No
- **required**: No
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **definition**: Start time of program in broadcast time zone
- **internal use only**: Yes
- **usage notes**: Primarily used for TV Archive items.
- **label**: Local Start Time
- **edit access**: IA admin
- **defined by**: IA software
- **example**: 
```
2010-03-26 18:00:00
```


#### start_time

- **repeatable**: No
- **required**: No
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **definition**: Start time of program in UTC
- **example**: 
```
2010-03-26 15:00:00
```

- **usage notes**: Primarily used for TV Archive items.
- **label**: UTC Start Time
- **defined by**: IA software
- **edit access**: IA admin
- **internal use only**: Yes

#### stop_time
- **internal use only**: Yes
- **usage notes**: Primarily used for TV Archive items.
- **definition**: Stop time of program in UTC
- **required**: No
- **label**: UTC Stop Time

- **repeatable**: No
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **edit access**: IA admin
- **defined by**: IA software
- **example**: 
```
2010-03-26 16:00:00
```


#### title_message
- **internal use only**: Yes
- **definition**: Adds text to the item header &lt;title&gt;
- **required**: No
- **label**: Title Message

- **repeatable**: No
- **accepted values**: text
- **edit access**: IA admin
- **defined by**: IA admin

#### tuner
- **internal use only**: Yes
- **usage notes**: Primarily used for TV Archive items.  Maps the program number as used in H.222 Program Association Tables and Program Mapping Tables to a channel number that can be entered via digits on a receiver&#39;s remote control.
- **definition**: Virtual Channel the video was recorded from
- **required**: No
- **label**: Skip OCR

- **repeatable**: No
- **accepted values**: String
- **edit access**: IA admin
- **defined by**: IA software
- **example**: 
```
Virtual Ch. 24
```


#### updated
- **internal use only**: Yes
- **usage notes**: Timestamp is typically when the last task ran on the item, but metadata updates can also be triggered manually.
- **definition**: Timestamp in the metadata table for the last time the item&#39;s row in that table was written
- **required**: No
- **label**: Updated

- **repeatable**: Yes
- **accepted values**: YYYY-MM-DD
- **edit access**: not editable
- **defined by**: IA software
- **example**: 
```
2014-12-05
```


#### updatedate

- **repeatable**: Yes
- **required**: No
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **definition**: Date the item was updated by updater
- **internal use only**: Yes
- **label**: Update Date
- **defined by**: IA software
- **example**: 
```
2009-03-02 21:48:28
```

- **edit access**: not editable
- **usage notes**: Any time an item is changed via the editxml page by the updater (see &lt;updater&gt; field), a corresponding &lt;updatedate&gt; field is added to the meta.xml.    Updatedate fields are added to meta.xml in the order changes have been made, so the oldest dates are listed first.  

#### updater
- **internal use only**: Yes
- **usage notes**: After initial upload, when changes are made to the content of an item the account that made changes is included in the meta.xml in an &lt;updater&gt; field.    Updater fields are added to meta.xml in the order changes have been made, so the first listed updater belongs to the oldest modification.  
- **definition**: Screen name of the account that updated the item
- **required**: No
- **label**: Updater

- **repeatable**: Yes
- **accepted values**: String
- **edit access**: not editable
- **defined by**: IA software
- **example**: 
```
tracey pooh
```


#### uploader
- **internal use only**: Yes
- **usage notes**: The uploader field determines which account has full access to modify/edit/delete metadata and files from the item without having any special privileges granted.  Any other account that wants to modify this item must have some level of administrative privilege granted by Internet Archive.
- **definition**: Email address of the account that uploaded the item to archive.org.
- **required**: Yes
- **label**: Item Uploader

- **repeatable**: No
- **accepted values**: Email address
- **edit access**: IA admin
- **defined by**: IA software
- **example**: 
```
footage@panix.com
```


#### utc_offset

- **repeatable**: No
- **required**: No
- **accepted values**: Whole number
- **definition**: Offset between local time and UTC
- **internal use only**: Yes
- **usage notes**: Primarily used for TV Archive items.
- **label**: UTC Offset
- **edit access**: IA admin
- **defined by**: IA software
- **example**: 
```
300
```


```
-400
```


#### video_codec
- **internal use only**: Yes
- **usage notes**: Primarily used for TV Archive items.
- **definition**: Program used to decode video stream
- **required**: No
- **label**: Video Codec

- **repeatable**: No
- **accepted values**: String
- **edit access**: IA admin
- **defined by**: IA software
- **example**: 
```
mpeg2video
```


#### viruscheck

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Virus Check
- **definition**: Causes virus check task to run on any item added to the collection
- **accepted values**: true
- **usage notes**: This tag only functions on items of mediatype collection.  The tag is either present with a value of &#34;true&#34; or it should not be present in the item metadata at all.  Currently all items uploaded into the open community collections have the virus check task run on them, without needing this tag.  Any other collection that needs virus checking should have this tag present in order to trigger the virus check task to run on items uploaded into the collection.
- **example**: 
```
true
```


## File Metadata Schema

Below are _files.xml fields that have special meaning on archive.org.
Jump to: {ref}`Public File Metadata Fields <public-files-fields>` | {ref}`Internal Only File Metadata Fields <internal-only-files-fields>`

(public-files-fields)=
### Public File Metadata Fields
<a name="public-files-fields"></a>


#### adaptive_ocr
- **required**: No
- **repeatable**: No

- **defined by**: uploader
- **internal use only**: No
- **definition**: Allows deriver to skip a page that would otherwise disrupt OCR
- **accepted values**: true
- **edit access**: uploader
- **label**: Adaptive OCR

#### addeddate
- **required**: Yes
- **repeatable**: No

- **usage notes**: Beginning in December 2019 when item was first added to public search engine. It is added during the first task where the item does not have noindex present in meta.xml. The field is not changed or removed if the item is subsequently removed from public search.   Prior to December 2019, Addeddate was automatically set when the item directory is been created in our file system.   In many cases, the addeddate will be very similar to the publicdate.  However, in some cases we create an item directory with metadata but no media files prior to the media being scanned.  The addeddate reflects when the item was created, regardless of when the media was added to the item.  When the media is added at a later date and a derive.php task is run, the publicdate will be added to the item.
- **defined by**: IA software
- **internal use only**: No
- **definition**: 2019-12 and later dates: represents time item was added to public search engine.  Earlier dates: Date and time in UTC that the item was created archive.org
- **example**: 
```
2017-03-28 22:05:46
```

- **accepted values**: YYYY-MM-DD HH:MM:SS,YYYY-MM-DD
- **edit access**: not editable
- **label**: Date Added to Public Search

#### aspect_ratio
- **definition**: Ratio of the pixel width and height of a video stream
- **required**: No
- **label**: Aspect Ratio
- **repeatable**: No
- **accepted values**: #:#

- **usage notes**: Standard values for this field are 4:3 and 16:9, but other values are possible.
- **defined by**: uploader
- **internal use only**: No
- **example**: 
```
4:3
```

- **edit access**: uploader

#### audio_codec
- **required**: No
- **repeatable**: No

- **usage notes**: Primarily used for TV Archive items.
- **defined by**: IA software
- **internal use only**: No
- **definition**: Program used to decode audio stream
- **example**: 
```
ac3
```

- **accepted values**: String
- **edit access**: IA admin
- **label**: Audio Codec

#### audio_sample_rate
- **required**: No
- **repeatable**: No

- **usage notes**: Primarily used for TV Archive items.
- **defined by**: IA software
- **internal use only**: No
- **definition**: Samples per second
- **example**: 
```
48000
```

- **accepted values**: Whole number
- **edit access**: IA admin
- **label**: Audio Sample Rate

#### betterpdf
- **usage notes**: This field is either set to the value true, or is not included in meta.xml.    If this field is included after the initial derive is run, user should also run a derive task to create the better quality PDF.
- **definition**: Indicates that the derive module should create a higher quality PDF derivative (distinguishes text from background better).
- **required**: No
- **label**: Better PDF
- **repeatable**: No
- **accepted values**: true
- **example**: 
```
true
```


- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### bookreader-defaults
- **required**: No
- **label**: Bookreader defaults
- **repeatable**: No
- **example**: 
```
mode/1up
```


- **usage notes**: The bookreader defaults to showing books in 2up mode, so this field is generally only used to indicate that an item should be displayed in 1up mode (showing only one page at a time in the bookreader).
- **defined by**: uploader
- **internal use only**: No
- **definition**: Indicates whether the bookreader should display one or two pages by default
- **accepted values**: mode/1up,mode/2up,mode/thumb
- **edit access**: uploader

#### bwocr
- **required**: No
- **label**: Black and White OCR
- **repeatable**: No

- **defined by**: uploader
- **internal use only**: No
- **definition**: Allows deriver to OCR specific pages as B&amp;W if color is causing failure.
- **accepted values**: page number or range, e.g. 001
- **edit access**: uploader

#### call_number
- **definition**: Contributing library&#39;s local call number
- **required**: No
- **repeatable**: No
- **example**: 
```
6675707
```


```
NC 285.1 P9287m
```


- **defined by**: uploader
- **internal use only**: No
- **accepted values**: string
- **edit access**: uploader
- **label**: Call Number

#### camera
- **definition**: Camera model used during digitization process
- **required**: No
- **label**: Camera
- **repeatable**: No
- **accepted values**: String

- **example**: 
```
Canon 5D
```

- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin

#### ccnum
- **required**: No
- **label**: Closed Captioning Number
- **repeatable**: No

- **usage notes**: Primarily used for TV Archive items. Closed captioning files are stored as [identifier].cc#.txt in the item.  This tag indicates which cc# file to display in item and use for search indexing. 
- **defined by**: uploader
- **internal use only**: No
- **definition**: Indicates which closed captioning file should be used for display and search
- **example**: 
```
cc5
```

- **accepted values**: cc#,asr,ocr,#,
- **edit access**: uploader

#### closed_captioning
- **usage notes**: Field is generally only present when the video has closed captioning.  When captioning is not present, the field may have &#34;no&#34; as the value, or just not be included in meta.xml
- **definition**: Indicates whether item contains closed captioning files
- **required**: No
- **label**: Closed Captioning
- **repeatable**: No
- **accepted values**: yes,no
- **example**: 
```
yes
```


```
no
```


- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### collection
- **definition**: Indicates to the website what collection(s) this item belongs to. 
- **required**: No
- **label**: Collections
- **repeatable**: Yes
- **usage notes**: Required for all items except &#34;fav-username&#34; collections.   Always list the item&#39;s primary collection first in meta.xml; this is the collection the item &#34;belongs&#34; to.  The primary collection often represents the entity that contributed or created the content.  Uploaders can only choose from collections that they have privileges for.  General uploaders with no special privs can only upload to selected &#34;Community&#34; collections or the test_collection. Items in the test_collection are removed from the site after 30 days.  &lt;b&gt;Parent collections:&lt;/b&gt;  If the parent collections of an item&#39;s collections are not already included in the item&#39;s own collection list, they will be automatically added (at the end of the next task on the item).  Here, more specifically, is how that addition takes place:  All of the item&#39;s currently listed collections are considered in turn. For each of them, we trace its ancestry all the way up to the top-level collection (usually a mediatype); in tracing ancestry, we consider only the primary (first-listed) parent collection at each step. If the original item is itself a collection, we include the top-level collection, otherwise we don&#39;t. Any collection we encounter during this traversal of the hierarchy that isn&#39;t already in the item&#39;s collection list gets added to the end of the list.  For example, if the original item starts with collections A and B listed, we find A’s primary parent (call it A-P), that collection’s primary parent (A-P-P), etc., until we hit a mediatype; all of those that aren&#39;t already listed get added, including the mediatype if the item itself is a collection. Then we do the same for B and its primary parent B-P, B-P-P, etc.

- **example**: 
```
prelinger
```

- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **accepted values**: Must be a valid identifier

#### color
- **required**: No
- **repeatable**: No

- **usage notes**: Most used values are: color, B&amp;W (black and white)  Mostly used for video items, indicates whether video is color or black and white.  Can be used to indicate different kinds of color (e.g. Kodachrome).
- **defined by**: uploader
- **internal use only**: No
- **definition**: Indicates whether media is in color or black and white
- **example**: 
```
color
```

- **accepted values**: String
- **edit access**: uploader
- **label**: Color

#### condition 
- **required**: No
- **label**: Condition
- **repeatable**: No

- **accepted values**: Mint,Near Mint,Very Good,Good,Fair,Worn,Poor,Fragile,Incomplete
- **definition**: condition of media
- **example**: 
```
Good
```

- **usage notes**: Defines the condition of the media in an item.   In 78s and LPs this indicates the condition of the disc or media file. For sets with multiple discs, use the condition of the lowest grade disc in the set.
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### condition-visual
- **required**: No
- **label**: Visual Condition
- **repeatable**: No
- **example**: 
```
Good
```


- **accepted values**: Mint,Near Mint,Very Good,Good,Fair,Worn,Poor,Fragile,Incomplete,None,Unknown
- **definition**: condition of the artwork or printed materials that accompany a media item
- **usage notes**: Defines the condition of the artwork or printed materials that accompany the media in an item. In LPs this is used for album covers and sleeves.   &#34;Incomplete&#34; should be used when we know that artwork/printed materials are missing.  &#34;None&#34; should be used when the item has no artwork/printed materials and we know it is not supposed to have any.  &#34;Unknown&#34; should be used when artwork/printed material MAY be missing, but we cannot verify.
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### contributor
- **usage notes**: For physical items that have been digitized, contributor represents the library or other organization that owns the physical item.  For born-digital media, contributor often represents the organization responsible for the distribution of the content (e.g. a radio station or television station).
- **required**: No
- **label**: Contributor
- **repeatable**: No

- **accepted values**: String
- **definition**: The person or organization that provided the physical or digital media.
- **example**: 
```
Robarts - University of Toronto
```

- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### coverage
- **required**: No
- **repeatable**: Yes

- **usage notes**: The preferred use of this field is to signify a geographical location that relates to the item. For example, in the TV and radio collections, we use the ISO 3166 location code for the country and state/territory of the station being recorded.
- **defined by**: uploader
- **internal use only**: No
- **definition**: Geographic or subject area covered by item
- **example**: 
```
GB-LND
```

- **accepted values**: String
- **edit access**: uploader
- **label**: Coverage

#### creator
- **required**: No
- **repeatable**: Yes

- **label**: Creator
- **accepted values**: String
- **definition**: The individual(s) or organization that created the media content.
- **example**: 
```
Austen, Jane, 1775-1817
```


```
Ralph Burns
```

- **usage notes**: For items provided by libraries, the creator is often listed using the Library of Congress Name Authority Headings, http://authorities.loc.gov/  For items from other sources, the creator is often listed as first name and surname.    When an item was created by an organization, such as a government agency or a production company, use the full name of the organization.  This field represents the entity who created the media, not the person who uploaded the media to archive.org (though these may be the same person).  All alphabets supported.
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### creator-alt-script
- **required**: No
- **repeatable**: No

- **internal use only**: No
- **defined by**: uploader
- **label**: Creator Alternate Script
- **edit access**: uploader
- **accepted values**: 

#### date
- **required**: No
- **repeatable**: No

- **usage notes**: We encourage people to use YYYY, YYYY-MM, or YYYY-MM-DD for this field, but sometimes exact dates are not possible to determine.  Other common usages: [YYYY] (brackets) when a date is not certain;  c.a. YYYY (c.a.) when a date is approximate; and [n.d.] when a date is unknown (you may also leave the field blank in this case). If an item has a date range, such as YYYY-YYYY, we currently index only the first date in the range.  Books, movies, and CDs often only have YYYY for a publication date.  Magazines often have YYYY-MM for a publication date.  Concerts and articles often have YYYY-MM-DD publication dates.  Use the most specific verifiable date you have access to.  When the item is a digitial representation of a physical piece of media (e.g. a book, a 78rpm disc, etc.) the publication date should represent the date that the specific physical item was published.  A book may have been written in 1850, and then an edition was republished in 1885.  If the digitized version is the edition republished in 1885, use 1885 as the publication date (not 1850).
- **defined by**: uploader
- **internal use only**: No
- **definition**: Date of publication
- **example**: 
```
1965
```


```
2013-05-25
```


```
[n.d.]
```

- **accepted values**: String
- **edit access**: uploader
- **label**: Publication Date

#### description
- **required**: Recommended
- **repeatable**: Yes

- **accepted values**: String, can contain links, formatting and images in html/css. Currently, with Collections, it can also contain raw Javascript, but we plan to remove this soon.
- **usage notes**: May be about the media content (e.g. a description of the book&#39;s plot), the physical item it represents (e.g. missing or damaged pages in the physical book that was digitized), the creator of the media (e.g. author biographical info that relates to the book), or any other information that may help a user understand the item or its context. All alphabets are supported.
- **definition**: Describes the media stored in the item.  
- **label**: Item Description
- **internal use only**: No
- **example**: 
```
 Cinemascope homage to the city of San Francisco made by amateur filmmaker and inventor Tullio Pellegrini. 
```

- **defined by**: uploader
- **edit access**: uploader

#### external-identifier
- **required**: No
- **repeatable**: Yes

- **definition**: URLs or identifiers to outside resources that represent the media
- **label**: External Identifier
- **accepted values**: String
- **example**: 
```
urn:publisher_catalog_id:88697 03614 2
```


```
urn:pubcat:victor:18890-B
```


```
urn:spotify:album:3jmETApVCjXb3hWTR1IEdH
```


```
urn:asin:0451531396
```


```
acs:epub:urn:uuid:d935586b-72a7-4720-bbb9-72fe75eae0e1
```


```
urn:acs6:blackreconstruc00dubo:epub:38413c16-074b-4fb6-a4dc-25e93e199d5f
```


```
urn:mb_artist_id:6de0f914-3e60-4418-be3b-42e0feb6eb4d
```


```
urn:X-pwacrawlid:AWP5
```

- **usage notes**: External-identifier includes Uniform Resource Names (URNs) for external resources about the media in the item. The field is usually in the form of urn:namespace:identifier.
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### firstfiledate
- **required**: No
- **repeatable**: No

- **definition**: Creation date of the earliest file contained in the item
- **label**: First File Date
- **accepted values**: YYYYMMDDHHMMSS
- **example**: 
```
20211103001952
```

- **usage notes**: Primarily used for WARC items
- **internal use only**: No
- **defined by**: IA software
- **edit access**: uploader

#### fixed-ppi
- **required**: No
- **repeatable**: No

- **definition**: To change the ppi to a specific resolution. Usually lower especially when jp2.zip fails
- **label**: Fixed PPI
- **accepted values**: Number
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader

#### frames_per_second
- **required**: No
- **repeatable**: No

- **usage notes**: Primarily used for TV Archive items.
- **defined by**: IA software
- **internal use only**: No
- **definition**: Frequency at which consecutive images are displayed
- **example**: 
```
29.97
```

- **accepted values**: Number
- **edit access**: uploader
- **label**: Frames Per Second

#### identifier

- **required**: Yes
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: IA admin
- **label**: Item Identifier
- **definition**: Unique identifier for an item on the archive.org web site. Used in the URL for the item, ie archive.org/details/[identifier].
- **accepted values**: String, minimum length is 5 characters, maximum length is 100 characters, contains only Roman alphabet characters, numbers, periods (.), underscores ( _ ), or dashes ( - ), and first character must be alphanumeric.,,mediatype:account items begin with @ symbol.
- **usage notes**: We encourage the use of human-readable identifiers, rather than opaque strings of numbers or letters.  For most projects we try to keep identifiers below 80 characters in length for the sake of readability.
- **example**: 
```
SanFrancisco1955CinemascopeFilm
```


#### identifier-ark

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: ARK
- **definition**: Archival Resource Key identifier
- **accepted values**: ark:/NAAN/Name
- **usage notes**: ARKs are URLs designed to support long-term access to information objects. We store the ark:/NAAN/Name portion of the URL in meta.xml.  This can be tacked on to any ARK resolver&#39;s domain to resolve the ARK, i.e. http://n2t.net/.  Read about ARKs: http://n2t.net/e/ark_ids.html  ARK specification: http://n2t.net/e/arkspec.txt
- **example**: 
```
ark:/13960/t4rj5fk7h
```


#### identifier-bib

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Local Identifier
- **definition**: Additional local identifiers
- **accepted values**: string
- **usage notes**: Fields for many identifiers exist in the schema, including isbn, issn, oclc, and call_number. The identifier-bib field is used for additional local identifiers that don&#39;t have a place elsewhere in metadata. These identifiers are unique to the institution providing the item.
- **example**: 
```
GLAD-84064318
```


#### isbn

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: ISBN
- **definition**: ISBN-10 or ISBN-13
- **accepted values**: String of 10 or 13 digits.,Final digit can be [0-9] or &#39;X&#39;
- **usage notes**:  https://www.iso.org/standard/65483.html https://www.isbn.org/faqs_general_questions#isbn_faq5
- **example**: 
```
3540212507
```


```
031294716X
```


#### issn

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: ISSN
- **definition**: ISSN
- **accepted values**: String of 2 groups of four digits separated by a hyphen. Final digit can be [0-9] or &#39;X&#39;
- **usage notes**: ISSNs are identifying numbers for serials. See https://www.issn.org/understanding-the-issn/what-is-an-issn/ for clarification.
- **example**: 
```
2528-7788
```


```
1943-345X
```


#### language

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Language
- **definition**: The language the media is written or recorded in.
- **accepted values**: String
- **usage notes**: For items provided by libraries, the language is often provided as a 3 letter MARC language code (e.g. eng), https://www.loc.gov/marc/languages/  For other items, the language is often written out as the full name (e.g. English).  Not all items have a language associated with them (e.g. instrumental music), but when there is written or spoken language we are able to do some sorts of processing better when we know the language.    To skip OCR on an item, set the value to None  When an item contains no OCRable content, you will sometimes see the language set to zxx.  Language is particularly important for text items so that we can do the best job with optical character recognition processing.
- **example**: 
```
eng
```


```
Italian
```


```
None
```


#### lastfiledate

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA software
- **edit access**: uploader
- **label**: Last File Date
- **definition**: Date of creation of oldest file in the item
- **accepted values**: YYYYMMDDHHMMSS
- **usage notes**: Primarily used for WARC items
- **example**: 
```
20211103003910
```


#### lccn

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: LCCN
- **definition**: Library of Congress Call Number
- **accepted values**: Whole number
- **usage notes**: https://www.loc.gov/marc/lccn_structure.html
- **example**: 
```
2004045278
```


#### licenseurl

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: License URL
- **definition**: URL of the selected license
- **accepted values**: URL
- **usage notes**: This link should point to a recognized license, like Creative Commons or GNU.  For other types of rights statements, use the rights field.
- **example**: 
```
http://creativecommons.org/licenses/by-nd/3.0/
```


#### marc-insert-only

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Marc Insert Only
- **definition**: restricting the incorporation of MARC-extracted metadata to fields that currently have no value (“insert only” behavior),
- **accepted values**: true
- **usage notes**: there are certain classes of item for which we insert MARC-extracted metadata only where no value currently exists in the item metadata for that field, so that we won’t overwrite any existing metadata. if their items are readily identifiable, the same restriction can be applied to those items.
- **example**: 
```
true
```


#### mediatype

- **required**: Yes
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: IA admin
- **label**: Type of Media
- **definition**: Mediatype tells us about the main content of the item. It is used to determine how the item is displayed on the web site and may trigger special processing depending on the types of files contained in the item.
- **accepted values**: texts,etree,audio,movies,software,image,data,web,collection,account
- **usage notes**: texts: books, articles, newspapers, magazines, any documents with content that contains text etree: live music concerts, items should only be uploaded for artists with collections in the etree &#34;Live Music Archive&#34; community audio: any item where the main media content is audio files, like FLAC, mp3, WAV, etc.  movies: any item where the main media content is video files, like mpeg, mov, avi, etc. software: any item where the main media content is software intended to be run on a computer or related device such as gaming devices, phones, etc. image: any item where the main media content is image files (but is not a book or other text item), like jpeg, gif, tiff, etc. data: any item where the main content is not media or web pages, such as data sets web: any item where the main content is copies of web pages, usually stored in WARC or ARC format collection: designates the item as a collection that can &#34;contain&#34; other items account: designates the item as being a user account page, can only be set by internal archive systems
- **example**: 
```
movies
```


#### notes

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Notes
- **definition**: additional notes about the item
- **accepted values**: String
- **usage notes**: Use the description field to describe the media stored in an item. The notes field is for additional information like condition of othe physical item, technical notes about digitization, or similar.

#### oclc-id

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: OCLC ID
- **definition**: Identifier of same edition in OCLC records
- **accepted values**: String
- **example**: 
```
37432884
```


#### openlibrary

- **required**: Deprecated
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library Identifier
- **definition**: Deprecated. Open Library edition identifier
- **accepted values**: OL#M
- **usage notes**: This field is deprecated. Please use openlibrary_edition.
- **example**: 
```
OL2769393M
```


#### openlibrary_author

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library author
- **definition**: Open Library author
- **accepted values**: OL#A
- **usage notes**: Correlates to the edition page on openlibrary.org. The OL edition page URL is https://openlibrary.org/books/[openlibrary_edition]
- **example**: 
```
OL52922A
```


#### openlibrary_edition

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library edition identifier
- **definition**: Open Library edition identifier
- **accepted values**: OL#M
- **usage notes**: Correlates to the edition page on openlibrary.org. The OL edition page URL is https://openlibrary.org/books/[openlibrary_edition]
- **example**: 
```
OL2769393M
```


#### openlibrary_subject

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library subject
- **definition**: Open Library subject
- **accepted values**: string
- **usage notes**: This field is currently used to supply books for carousels on the openlibrary.org home page. At some point it will also be used to import subjects from the openlibrary_work associated with the item.
- **example**: 
```
openlibrary_staff_picks
```


#### openlibrary_work

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Open Library work identifier
- **definition**: Open Library work identifier
- **accepted values**: OL#W
- **usage notes**: Correlates to the work page on openlibrary.org. The OL work page URL is https://openlibrary.org/works/[openlibrary_edition]
- **example**: 
```
OL675783W
```


#### page-progression

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Page Progression
- **definition**: Determines direction pages will be &#34;turned&#34; in a book
- **accepted values**: lr,rl
- **usage notes**: lr = left to right rl = right to left
- **example**: 
```
rl
```


```
lr
```


#### possible-copyright-status

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Possible Copyright Status
- **definition**: Information relevant to copyright status
- **accepted values**: string
- **usage notes**: Do not use this field for CC license information (see licenseurl).
- **example**: 
```
The Centers for Medicare &amp; Medicaid Services Library is unaware of any copyright restrictions for this item.
```


#### ppi

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: PPI
- **definition**: Pixels per inch
- **accepted values**: Positive whole number
- **usage notes**: Indicates pixels per inch for an image.  The most common use case is Internet Archive digitization centers.  This number is set during the book scanning process.
- **example**: 
```
300
```


#### publisher

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Publisher
- **definition**: Publisher of the media
- **accepted values**: String
- **usage notes**: - Books use publisher - Movies often use production company - Music often uses record label
- **example**: 
```
New York : R.R. Bowker Co.
```


#### related_collection

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **label**: Related Collection
- **definition**: Adds links to related collection on a collection&#39;s &#34;About&#34; page
- **accepted values**: Identifier

#### related-external-id

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Related External Identifier
- **definition**: URLs or identifiers to resources related to the media, but not representing this exact form of the work
- **accepted values**: String
- **usage notes**: Related-external-id includes URNs for media related to the media in the item, but which are not exactly the same.  The primary use of this tag is to list ISBNs, LCCNs, and OCLC numbers for other editions of the same work.  These IDs are used for deduplication purposes in the scanning proces.
- **example**: 
```
urn:isbn:0671038303
```


#### rights

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Rights
- **definition**: Rights statement
- **accepted values**: String
- **usage notes**: Please see licenseurl for URL-based rights designations, like Creative Commons. For other rights information or statements, use the rights field.
- **example**: 
```
Permission is granted under the Wikimedia Foundation&#39;s 
```


```
These National Treasury publications may not be reproduced wholly or in part without the express authorisation of the National Treasury in writing unless used for non-profit purposes.
```


#### runtime

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: IA software
- **edit access**: uploader
- **label**: Run Time
- **definition**: Length of an audio or video item
- **accepted values**: HH:MM:SS,H:MM:SS,MM:SS,M:SS,0:SS
- **usage notes**: Uploader can set this field, but most often we have determined and set this value during the derive process.  
- **example**: 
```
00:15:00
```


```
2:12
```


```
0:23
```


#### scandate

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Scan Date
- **definition**: The date and time in UTC that the media was captured.
- **accepted values**: String
- **usage notes**: When an physical item is scanned/digitized, scandate represents the date/time that the digitization occurred.    For web items, scandate represents the date/time the first WARC file in the item was created.  For TV and radio items, scandate represents the begining time of the recording.  Formats: YYYYMMDDHHMMSS YYYYMMDD YYYY YYYY-MM-DD HH:MM:SS
- **example**: 
```
20170329201345
```


#### scanner

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Scanner
- **definition**: Machinery used to digitize or collect the media
- **accepted values**: String
- **usage notes**: Primarily an internally used field. For digitized texts this represents the individual digitization station (e.g. Scribe 2 in the New Jersey center).    For web items this represents the crawl machine used to gather the data.    For films this represents the film scanner.    For CDs this represents the version of the scanning software used for that CD.   For end-user contriuted items, this represents the software used to upload the item.
- **example**: 
```
scribe2.nj.archive.org
```


```
selenium-101.us.archive.org
```


```
Lasergraphics Scanstation
```


```
ArchiveCD Version 2.1.15
```


```
Internet Archive HTML5 Uploader 1.6.3
```


#### size

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Size
- **definition**: Size of physical item digitized
- **accepted values**: Number
- **usage notes**: This field is used for physical items that have been digitized. It denotes the size of the physical item. It is widely used to indicate the size of the record in our digitization efforts, e.g. 10 for 78s or 12 for vinyl. If no unit is measurement is specified, assume inches.
- **example**: 
```
10.0
```


#### sort-by

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **label**: Default Collection Sort
- **definition**: Allows default collection sort to be changed from the standard Views order
- **accepted values**: addeddate,-addeddate,creatorSorter,-creatorSorter,date,-date,downloads,-downloads,publicdate,-publicdate,reviewdate,-reviewdate,titleSorter,-titleSorter,,
- **usage notes**: This tag only works on items that are collection mediatype, and can only be set by people with privileges for that collection.  Sorting by -downloads is allowed, but would currently be redundant, as that is already the default sort for all collections without this tag.
- **example**: 
```
-date
```


#### sound

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Sound
- **definition**: Indicates whether media has sound or is silent
- **accepted values**: String
- **usage notes**: Most used values are: sound, silent  Mostly used for video items, this field indicates whether the media has related sound or is silent.
- **example**: 
```
sound
```


```
silent
```


#### source

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Source
- **definition**: Source of media
- **accepted values**: String
- **usage notes**: Used to signify where a piece of media originated, or what the physical media was prior to digitization.  - Focused crawl items list the site being crawled in this field.   - Texts digitization centers use the field to denote folios.  - TV uses the field to indicate the signal source.  - Internal audio digitization projects use this field to indicate the format of the original media (CD, LP, 78, etc.).  - External users often use this field to list a URL where the media content originated. - Etree users use it to record the &#34;path&#34; for recording a live concert.
- **example**: 
```
folio
```


```
Comcast Cable
```


```
CD
```


```
DPA 4021 &gt; SX-M2 &gt; SD 744T @ 44.1 kHZ/16 bit
```


#### sponsor

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Sponsor
- **definition**: The person or organization that funded the digitization or collection of this media.
- **accepted values**: String
- **usage notes**: For physical items (books, film, 78rpm, etc.), this represents the entity that funded the digitization/scanning work.   For born-digital items (TV, Radio, Web, etc.) this represents the entity that funded the collection of the items.
- **example**: 
```
Kahle-Austin Foundation
```


#### subject

- **required**: No
- **repeatable**: Yes
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Subject/Keyword
- **definition**: Subjects and/or topics covered by the media content
- **accepted values**: String
- **usage notes**: Books and other media objects from libraries often use Library of Congress Subject Headings, http://id.loc.gov/authorities/subjects.html. Some collections may use their own controlled vocabulary for setting subjects. Many other items use the subject field as more casual &#34;tags.&#34;  All alphabets are supported.
- **example**: 
```
France
```


#### summary

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: user admin
- **edit access**: user admin
- **label**: Collection summary
- **definition**: A summary section that appears on collection pages above the description, entire value appears at the top of the collection tab
- **accepted values**: String, can contain links, formatting and images in html/css. Currently, with Collections, it can also contain raw Javascript, but we plan to remove this soon.
- **usage notes**: This tag only works on items that are collection mediatype, and can only be set by people with privileges for that collection.  Normally collection pages only show the first 2 lines of the collection description field on the Collection tab. Content entered into the summary tag for a collection will show at the top of the Collection tab in place of those 2 lines, can include HTML, and be any length (though we recommend keeping it as brief as possible).
- **example**: 
```
The Universal School Library (USL), is a growing collection of digitized books within the Internet Archive&#39;s larger holdings, made available through controlled digital lending, and curated by a national advisory group of school librarians, librarian educators and researchers.
```


#### title

- **required**: Recommended
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Title
- **definition**: Title of media
- **accepted values**: String, plain text; no HTML or HTML entities (they&#39;ll be displayed in raw form).
- **usage notes**: All alphabets are supported
- **example**: 
```
San Francisco (1955 Cinemascope film)
```


#### title-alt-script

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Title Alternate Script
- **accepted values**: text

#### volume

- **required**: No
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Volume
- **definition**: Volume number or name
- **accepted values**: string
- **usage notes**: This field is not overwritten by MARC
- **example**: 
```
15
```


#### year

- **required**: Deprecated
- **repeatable**: No
- **internal use only**: No
- **defined by**: uploader
- **edit access**: uploader
- **label**: Year of Publication
- **definition**: Deprecated, use date field
- **accepted values**: YYYY
- **usage notes**: Deprecated, use date field
- **example**: 
```
1996
```


(internal-only-files-fields)=
### Internal Only File Metadata Fields
<a name="internal-only-files-fields"></a>


#### access-restricted
- **required**: No
- **repeatable**: No
- **definition**: Collection contents are restricted access
- **accepted values**: true
- **usage notes**: This tag is only used on items of mediatype collection (it will have no affect on items of any other type). This tag should only be assigned by internal IA admins.
- **label**: Access Restricted

- **internal use only**: Yes
- **example**: 
```
true
```

- **defined by**: IA admin
- **edit access**: IA admin

#### access-restricted-item
- **usage notes**: Only used on items, not collections. Automatically added to items in an access-restricted collection at the end of any task.
- **required**: No
- **label**: Access Restricted Item
- **repeatable**: No

- **defined by**: IA admin
- **internal use only**: Yes
- **definition**: Identifies item that is access-restricted
- **example**: 
```
true
```

- **accepted values**: true
- **edit access**: IA admin

#### admin-collection
- **required**: No
- **label**: Admin Collection
- **repeatable**: No

- **usage notes**: Only used by internal IA admins
- **defined by**: IA admin
- **internal use only**: Yes
- **definition**: Collection will generally be suppressed from public display, e.g. in facets, membership lists on Collection/Details pages, etc.
- **accepted values**: true
- **edit access**: IA admin
- **example**: 
```
true
```


#### boxid
- **required**: No
- **repeatable**: Yes

- **usage notes**: Boxids always start with the letters IA followed by numbers.  The numbers represent the container, pallet and box that the physical item is stored in.  When there are multiple boxid fields in meta.xml, the first boxid listed represents the physical item that was digitized.  Subsequent boxid fields represent the location of duplicate physical items.
- **defined by**: IA admin
- **internal use only**: Yes
- **definition**: Location of physical item in the Physical Archive
- **example**: 
```
IA158001
```

- **accepted values**: IA######
- **edit access**: IA admin
- **label**: Box ID

#### curation
- **required**: No
- **repeatable**: No

- **definition**: Curation state and notes
- **label**: Curation
- **accepted values**: String
- **example**: 
```
[curator]lenscriv@archive.org[/curator][date]20160504125613[/date][state]approved[/state][comment]199[/comment]
```


```
[curator]malware@archive.org[/curator][date]20140321085621[/date][comment]checked for malware[/comment]
```

- **usage notes**: Curation  is a compound field with &#34;sub-fields&#34;: curator, date, state, and comment.    - Curator is the email address of the person who added the curation tag.   - Date is the UTC time and date the curation tag was added, in YYYYMMDDHHMMSS format. - State can be: dark, approved, freeze, un-dark or blank - Comment can be a code used by the scanning center team to indicate issues found during QA, or a text string with some other curation comment (e.g. information about why an item was frozen or made dark).  Items uploaded into open collections are generally checked by malware detection software, and the curation field will contain the results of that check.
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin

#### foldoutcount
- **required**: No
- **repeatable**: No

- **accepted values**: Whole number
- **usage notes**: Fold outs are photographed on machinery other than the Scribe.  This field indicates how many foldouts were captured.  The value may be 0 or higher.
- **definition**: Number of fold outs captured by operator
- **label**: Fold Out Count
- **internal use only**: Yes
- **example**: 
```
1
```

- **defined by**: IA software
- **edit access**: IA admin

#### force-update
- **required**: No
- **repeatable**: No

- **definition**: For partner-funded scanned books (no boxid), this allows a MARC record in the item to overwrite metadata fields in meta.xml
- **label**: Force Update
- **accepted values**: true
- **example**: 
```
true
```

- **usage notes**: When this field is NOT present for partner scanned books (no boxid), metadata from a MARC record will only be used to automatically fill in EMPTY metadata fields in meta.xml, and fields that already have metadata in them will be left as-is. Adding force-update to the item causes MARC to overwrite all fields that can be extracted, regardless of whether they already contain information or not.
- **internal use only**: Yes
- **defined by**: uploader
- **edit access**: uploader

#### geo_restricted
- **definition**: Limits access based on ISO-2 Country Code
- **required**: No
- **repeatable**: No

- **accepted values**: e.g US
- **label**: Geo Restricted
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin

#### hidden

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: user admin
- **edit access**: user admin
- **label**: Hidden
- **definition**: Hides collection from top level navigation
- **accepted values**: true
- **usage notes**: This tag only functions on items of mediatype collection.
- **example**: 
```
true
```


#### imagecount

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA software
- **label**: Image Count
- **definition**: Imagecount gives an indication of the size of the content of an item (outside of file size, which is represented in the size field).  Originally used only for books, the field has been repurposed over time to provide similar information for other mediatypes.
- **accepted values**: Positive whole number
- **usage notes**: Texts: represents number of page images in the item  TV: represents number of seconds of video in the item  Web: represents number of URIs captured in the WARCs in the item  CD: number of images of physical item and accompanying materials
- **example**: 
```
230
```


#### neverindex

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Never Index
- **definition**: Prevents RePublisher from removing noindex at the end of the texts digitization process.
- **accepted values**: true
- **usage notes**: Only used on internally digitized texts items. Normally when a text finishes the RePublisher process, the noindex tag is removed and the book is added to the public search engine. The neverindex tag prevents the removal of noindex, so books with nevrindex set to true should not end up in the public search engine.
- **example**: 
```
true
```


#### next_item

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Next Item
- **definition**: IA identifier of next item from a recorded feed
- **accepted values**: identifier
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
BBCNEWS_20121204_090000_BBC_News
```


#### no_ol_import

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: No OL Import
- **definition**: Keeps books out of open library
- **accepted values**: true

#### noindex

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: uploader
- **edit access**: uploader
- **label**: No Index
- **definition**: Prevents item from being indexed in public archive.org search engine
- **accepted values**: true
- **usage notes**: While the accepted practice is to have a value of &#34;true&#34; for this tag, the mere presence of the tag in meta.xml will actually cause the same effect regardless of the value used (including empty).  In addition to not being included in the public archive.org search engine, the noindex tag will also cause the item to not be listed in the sitemap.
- **example**: 
```
true
```


#### ocr

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: OCR Software
- **definition**: Software package and version used for optical character recognition
- **accepted values**: String
- **usage notes**: Set during derivation process.
- **example**: 
```
ABBYY FineReader 8.0
```


#### operator

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Operator
- **definition**: Email of the person who scanned/captured the media in the item
- **accepted values**: String
- **usage notes**: usually email address. In texts this represents the person who operated the Scribe or other scanning equipment.  In web items this represents the engineer responsible for the crawl.
- **example**: 
```
associate-stephanie-kinsey@archive.org
```


#### previous_item

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Previous Item
- **definition**: IA identifier of previous item from a recorded feed
- **accepted values**: identifier
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
BBCNEWS_20121204_060000_Breakfast
```


#### public-format

- **required**: No
- **repeatable**: Yes
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Public Formats
- **definition**: Collection file formats that are available to users in an Access Restricted collection
- **accepted values**: String
- **usage notes**: This tag only affects items of mediatype collection and must be used in conjunction with the access-restricted tag.  This tag should only be assigned by internal IA admins.
- **example**: 
```
Metadata
```


#### publicdate

- **required**: Yes
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: not editable
- **label**: Date Archived
- **definition**: The date and time in UTC that the item was created on archive.org.
- **accepted values**: YYYY-MM-DD HH:MM:SS,YYYY-MM-DD
- **usage notes**: Publicdate is automatically set when the first catalog task finishes on that item&#39;s directory.
- **example**: 
```
2011-12-25 19:01:43
```


#### repub_state

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Repub State
- **definition**: Indicates the current state of a scanned book.
- **accepted values**: Whole number
- **example**: 
```
19
```


#### republisher

- **required**: Deprecated
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Republisher
- **definition**: Deprecated. Email of the person who completed republishing the item
- **accepted values**: email address
- **usage notes**: This field is deprecated. 
- **example**: 
```
associate-kiana-fekette@archive.org
```


#### republisher_date

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Republisher Date
- **definition**: Date and time in UTC that the item was created archive.org
- **accepted values**: YYYYMMDDHHMMSS
- **usage notes**: Set by Scribe3 software.
- **example**: 
```
20170801165730
```


#### republisher_operator

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Republisher Operator
- **definition**: Email of the person who completed republishing the item
- **accepted values**: email address
- **usage notes**: Set by Scribe3 software.
- **example**: 
```
associate-kiana-fekette@archive.org
```


#### republisher_time

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA software
- **label**: Republisher Time
- **definition**: Number of seconds required to republish text
- **accepted values**: whole number
- **usage notes**: Set by Scribe3 software.
- **example**: 
```
504
```


#### scanfee

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Scan Fee
- **definition**: Scanning fee used during billing process
- **accepted values**: string
- **usage notes**: Set by software based on parameters for each scanning partner
- **example**: 
```
100
```


```
300;10;200
```


```
0;1.45;0
```


#### scanningcenter

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Scanning Center
- **definition**: The location where a digital copy of the media item was created
- **accepted values**: String
- **usage notes**: Generally used in conjunction with our scanning services, this tag gives the location where an item was digitized, scanned or captured.
- **example**: 
```
boston
```


#### show_related_music_by_track

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Related Music by Track
- **definition**: Adds related tracks to details page
- **accepted values**: true

#### source_pixel_height

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Source Pixel Height
- **definition**: Pixel height of original video stream
- **accepted values**: Whole number
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
480
```


#### source_pixel_width

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Source Pixel Width
- **definition**: Pixel width of original video stream
- **accepted values**: Whole number
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
704
```


#### sponsordate

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Sponsor Date
- **definition**: Billing date for scanned materials
- **accepted values**: String
- **usage notes**: Related to digitization work. Usually a date string &#34;YYYYMMDD&#34;, but can contain notes, such as:  &#34;not to be invoiced-past billing period&#34; &#34;Grant ended, item not yet invoiced&#34; &#34;sent20111010&#34;
- **example**: 
```
20100531
```


#### start_localtime

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Local Start Time
- **definition**: Start time of program in broadcast time zone
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
2010-03-26 18:00:00
```


#### start_time

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: UTC Start Time
- **definition**: Start time of program in UTC
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
2010-03-26 15:00:00
```


#### stop_time

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: UTC Stop Time
- **definition**: Stop time of program in UTC
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
2010-03-26 16:00:00
```


#### title_message

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA admin
- **edit access**: IA admin
- **label**: Title Message
- **definition**: Adds text to the item header &lt;title&gt;
- **accepted values**: text

#### tuner

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Skip OCR
- **definition**: Virtual Channel the video was recorded from
- **accepted values**: String
- **usage notes**: Primarily used for TV Archive items.  Maps the program number as used in H.222 Program Association Tables and Program Mapping Tables to a channel number that can be entered via digits on a receiver&#39;s remote control.
- **example**: 
```
Virtual Ch. 24
```


#### updated

- **required**: No
- **repeatable**: Yes
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: not editable
- **label**: Updated
- **definition**: Timestamp in the metadata table for the last time the item&#39;s row in that table was written
- **accepted values**: YYYY-MM-DD
- **usage notes**: Timestamp is typically when the last task ran on the item, but metadata updates can also be triggered manually.
- **example**: 
```
2014-12-05
```


#### updatedate

- **required**: No
- **repeatable**: Yes
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: not editable
- **label**: Update Date
- **definition**: Date the item was updated by updater
- **accepted values**: YYYY-MM-DD HH:MM:SS
- **usage notes**: Any time an item is changed via the editxml page by the updater (see &lt;updater&gt; field), a corresponding &lt;updatedate&gt; field is added to the meta.xml.    Updatedate fields are added to meta.xml in the order changes have been made, so the oldest dates are listed first.  
- **example**: 
```
2009-03-02 21:48:28
```


#### updater

- **required**: No
- **repeatable**: Yes
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: not editable
- **label**: Updater
- **definition**: Screen name of the account that updated the item
- **accepted values**: String
- **usage notes**: After initial upload, when changes are made to the content of an item the account that made changes is included in the meta.xml in an &lt;updater&gt; field.    Updater fields are added to meta.xml in the order changes have been made, so the first listed updater belongs to the oldest modification.  
- **example**: 
```
tracey pooh
```


#### uploader

- **required**: Yes
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Item Uploader
- **definition**: Email address of the account that uploaded the item to archive.org.
- **accepted values**: Email address
- **usage notes**: The uploader field determines which account has full access to modify/edit/delete metadata and files from the item without having any special privileges granted.  Any other account that wants to modify this item must have some level of administrative privilege granted by Internet Archive.
- **example**: 
```
footage@panix.com
```


#### utc_offset

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: UTC Offset
- **definition**: Offset between local time and UTC
- **accepted values**: Whole number
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
300
```


```
-400
```


#### video_codec

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Video Codec
- **definition**: Program used to decode video stream
- **accepted values**: String
- **usage notes**: Primarily used for TV Archive items.
- **example**: 
```
mpeg2video
```


#### viruscheck

- **required**: No
- **repeatable**: No
- **internal use only**: Yes
- **defined by**: IA software
- **edit access**: IA admin
- **label**: Virus Check
- **definition**: Causes virus check task to run on any item added to the collection
- **accepted values**: true
- **usage notes**: This tag only functions on items of mediatype collection.  The tag is either present with a value of &#34;true&#34; or it should not be present in the item metadata at all.  Currently all items uploaded into the open community collections have the virus check task run on them, without needing this tag.  Any other collection that needs virus checking should have this tag present in order to trigger the virus check task to run on items uploaded into the collection.
- **example**: 
```
true
```


