# electron-auto update

**애플리케이션이 자동으로 업데이트를 진행할 수 있도록 기능을 활성화합니다.**

다음 프로젝트 중 하나를 선택하여, 애플리케이션을 배포하기 위한 멀티-플랫폼 릴리즈 서버를 손쉽게 구축할 수 있습니다:

- `nuts`: 애플리케이션을 위한 똑똑한 릴리즈 서버이며 GitHub를 백엔드로 사용합니다. Squirrel을 통해 자동 업데이트를 지원합니다. (Mac & Windows)
- `electron-release-server`: 완벽하게 모든 기능을 지원하는 electron 애플리케이션을 위한 자가 호스트 릴리즈 서버입니다. autoUpdater와 호환됩니다
- `squirrel-updates-server`: GitHub 릴리즈를 사용하는 Squirrel.Mac 와 Squirrel.Windows를 위한 간단한 node.js 기반 서버입니다


## Events
`autoUpdater` 객체는 다음과 같은 이벤트를 발생시킵니다:

Event: `error`

Returns: error Error

업데이트에 문제가 생기면 발생하는 이벤트입니다.

Event: `checking-for-update`

업데이트를 확인하기 시작할 때 발생하는 이벤트입니다.

Event: `update-available`

사용 가능한 업데이트가 있을 때 발생하는 이벤트입니다. 이벤트는 자동으로 다운로드 됩니다.

Event: `update-not-available`

사용 가능한 업데이트가 없을 때 발생하는 이벤트입니다.

Event: `update-downloaded`

Returns:
  - event Event
  - releaseNotes String
  - releaseName String
  - releaseDate Date
  - updateURL String

업데이트의 다운로드가 완료되었을 때 발생하는 이벤트입니다.
