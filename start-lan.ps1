$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173

while (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
  $port++
}

$pythonCandidates = @(
  "C:\Users\TianDu\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe",
  "python",
  "py"
)

$python = $pythonCandidates | Where-Object {
  if ($_ -like "*\*") {
    Test-Path -LiteralPath $_
  } else {
    $null -ne (Get-Command $_ -ErrorAction SilentlyContinue)
  }
} | Select-Object -First 1

if (-not $python) {
  throw "没有找到可用的 Python。请先安装 Python，或用 VS Code / 任意静态服务器打开本目录。"
}

$wifiIp = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.InterfaceAlias -match "WLAN|Wi-Fi|无线" -and $_.IPAddress -notlike "127.*" } |
  Select-Object -ExpandProperty IPAddress -First 1

if (-not $wifiIp) {
  $wifiIp = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown" } |
    Select-Object -ExpandProperty IPAddress -First 1
}

Write-Host ""
Write-Host "仅予你的晴天网站已启动" -ForegroundColor Green
Write-Host "电脑访问: http://127.0.0.1:$port/"
if ($wifiIp) {
  Write-Host "手机访问: http://$wifiIp`:$port/"
  Write-Host "手机需要和电脑连同一个 Wi-Fi。若打不开，请允许 Windows 防火墙放行 Python。"
}
Write-Host ""
Write-Host "按 Ctrl+C 可停止服务。"
Write-Host ""

Set-Location -LiteralPath $projectRoot
& $python -m http.server $port --bind 0.0.0.0
