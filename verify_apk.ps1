Add-Type -AssemblyName System.IO.Compression.FileSystem
$apkPath = (Resolve-Path "android\app\build\outputs\apk\debug\app-debug.apk").Path
$zip = [System.IO.Compression.ZipFile]::OpenRead($apkPath)
Write-Output "Checking APK: $apkPath"
$found = $false
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "*alert_sound*") {
        Write-Output "FOUND ENTRY: $($entry.FullName) (Size: $($entry.Length) bytes, Compressed: $($entry.CompressedLength) bytes)"
        $found = $true
    }
}
$zip.Dispose()
if (-not $found) {
    Write-Output "NOT FOUND in APK!"
}
