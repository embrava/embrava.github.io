This is the auto update information folder for Embrava Connect for Windows Software.

Github Repository:
-------------------
This folder is a part of the repository: https://github.com/embrava/embrava.github.io.git

To deploy the update of Embrava Connect for Windows, clone this repository on your PC using the github account credentials.

Then you can edit the files in the local repository on your pc and commit the changes to the remote repository (github server).

Embrava Connect Autoupdate deployment folder on the local repository:
----------------------------------------------------------------------

embrava.github.io\embrava\EmbravaConnectForWindows


Auto Update Information format:
--------------------------------

The auto update information has been defined in the json format in a file called updateinfo.json.

On each update its enough to edit the contents of releasenotes.txt and updateinfo.json.

Contents of the updateinfo.json:

{
	"version": "5.2.26",
	"installerUrl": "http://bit.ly/33RingN",
	"releaseDate": "06.September.2019"
}

version: This should be in the format a.b.c. Example as shown above 5.2.8. Enclose the string in double quotes.
installerUrl: This is the http / https url - which can be a direct url or bitly converted url of the Embrava Connect installer zip package.
releaseDate: This is the date on which this update is being released.

Do not edit the file names or delte the files in this auto update information folder.

Steps for deploying the update:
--------------------------------

1. Get the EmbravaConnect_va.b.c.zip installer zip package from the dev team. The autoupdate supports zip package only.
The zip file will have the files - EmbravaConnect.msi and Readme.txt. Don't edit the contents of the zip file or 
don't edit the name of the installer zip package.

2. Host the zip file (EmbravaConnect_va.b.c.zip) on any file hosting server to get the http / https download url. When this url is activated
by browser then this zip file would be downloaded. This is the direct url of the installer zip package.

3. Bitly tracking. We can use the bitly converted download url for this installer package. Use the direct url of the installer zip package 
on the bitly.com account and get the bitly url.

4. Now if you need tracking enter the bitly url in the installerUrl field of the updateinfo.json. If you don't need the tracking enter the 
direct url of the installer zip package in the installerUrl filed of the updateinfo.json.

5. Update the version field of the updateinfo.json.

6. Update the releaseDate field of the updateinfo.json.

7. Update the releasenotes.txt file in this folder.

8. Commit the changes to the repository.

This finishes the update deployment process.


