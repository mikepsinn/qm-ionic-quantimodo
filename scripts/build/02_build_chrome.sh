#!/bin/bash

if [ -z "$VERSION_NUMBER" ]
  then
    echo "${GREEN}No version parameter second argument given so using ${VERSION_NUMBER} as default version number...${NC}"
else
    echo -e "VERSION_NUMBER is $VERSION_NUMBER...${NC}"
fi

if [ -z "$BUILD_PATH" ]
  then
  echo "No BUILD_PATH given..."
    exit
fi

if [ -z "$PROJECT_ROOT" ]
  then
  echo "No PROJECT_ROOT given..."
    exit
fi

if [ -d "${PROJECT_ROOT}/apps" ];
    then
        echo "${PROJECT_ROOT}/apps path exists";
    else
        echo "${PROJECT_ROOT}/apps path not found!";
        exit
fi

echo -e "${GREEN}Copying www folder into app and extension${NC}"
mkdir -p "${BUILD_PATH}/${APP_NAME}/chrome_app/www"
mkdir -p "${BUILD_PATH}/${APP_NAME}/chrome_extension/www"
cp -R ${PROJECT_ROOT}/resources/chrome_app/* "${BUILD_PATH}/${APP_NAME}/chrome_app/"
cp -R ${PROJECT_ROOT}/resources/chrome_extension/* "${BUILD_PATH}/${APP_NAME}/chrome_extension/"
cp -R ${PROJECT_ROOT}/www/*  "${BUILD_PATH}/${APP_NAME}/chrome_app/www/"
cp -R ${PROJECT_ROOT}/www/*  "${BUILD_PATH}/${APP_NAME}/chrome_extension/www/"

rm -rf "${BUILD_PATH}/${APP_NAME}/chrome_extension/www/lib/phonegap-facebook-plugin/platforms/android"
rm -rf "${BUILD_PATH}/${APP_NAME}/chrome_extension/www/lib/phonegap-facebook-plugin/platforms/ios"
cd "${BUILD_PATH}/${APP_NAME}" && zip -r "${BUILD_PATH}/${APP_NAME}/${APP_NAME}-Chrome-Extension.zip" chrome_extension >/dev/null
echo "${APP_NAME} Chrome extension is ready"

rm -rf "${BUILD_PATH}/${APP_NAME}/chrome_app/www/lib/phonegap-facebook-plugin/platforms/android"
rm -rf "${BUILD_PATH}/${APP_NAME}/chrome_app/www/lib/phonegap-facebook-plugin/platforms/ios"
cd "${BUILD_PATH}/${APP_NAME}" && zip -r "${BUILD_PATH}/${APP_NAME}/${APP_NAME}-Chrome-App.zip" chrome_app >/dev/null
echo "${APP_NAME} Chrome app is ready"

mkdir "$DROPBOX_PATH/$APP_NAME"
echo -e "${GREEN}Copying ${BUILD_PATH}/${APP_NAME} to $DROPBOX_PATH/${APP_NAME}/${NC}"
cp -R ${BUILD_PATH}/${APP_NAME}/* "$DROPBOX_PATH/${APP_NAME}/"
