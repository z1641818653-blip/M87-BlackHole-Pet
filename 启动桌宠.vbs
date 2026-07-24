Option Explicit

Dim fso, shell, projectDir, electronExe, command
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
electronExe = fso.BuildPath(projectDir, "node_modules\electron\dist\electron.exe")
shell.CurrentDirectory = projectDir

If Not fso.FileExists(electronExe) Then
  MsgBox "Electron is not installed yet. Run the install-and-start CMD file first.", 48, "M87 Black Hole Pet"
  WScript.Quit 1
End If

command = Chr(34) & electronExe & Chr(34) & " ."
shell.Run command, 0, False
