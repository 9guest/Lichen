!macro customInstall
  DetailPrint "Register ycslichen URI Handler"
  DeleteRegKey HKCR "ycslichen"
  WriteRegStr HKCR "ycslichen" "" "URL:ycslichen"
  WriteRegStr HKCR "ycslichen" "URL Protocol" ""
  WriteRegStr HKCR "ycslichen\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "ycslichen\shell" "" ""
  WriteRegStr HKCR "ycslichen\shell\Open" "" ""
  WriteRegStr HKCR "ycslichen\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DetailPrint "Unregister ycslichen URI Handler"
  DeleteRegKey HKCR "ycslichen"
  MessageBox MB_OK "ycslichen has been uninstalled."
!macroend

