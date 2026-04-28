!macro customInstall
  DetailPrint "Register elecflow URI Handler"
  DeleteRegKey HKCR "elecflow"
  WriteRegStr HKCR "elecflow" "" "URL:elecflow"
  WriteRegStr HKCR "elecflow" "URL Protocol" ""
  WriteRegStr HKCR "elecflow\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "elecflow\shell" "" ""
  WriteRegStr HKCR "elecflow\shell\Open" "" ""
  WriteRegStr HKCR "elecflow\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DetailPrint "Unregister elecflow URI Handler"
  DeleteRegKey HKCR "elecflow"
  MessageBox MB_OK "ElecflowTemplate has been uninstalled."
!macroend

