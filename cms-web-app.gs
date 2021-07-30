function onOpen() {
    SpreadsheetApp.getUi().createMenu('Adv').addItem('Tester', 'popup').addToUi();
}

function doGet(e) {
    var htmlTemplate = HtmlService.createTemplateFromFile('index');
    var ss = SpreadsheetApp.openById('1-6mzNSLtjoaFFbIKEhhVsocDfQELhcbNTE70VwxqVB4');
    var sheets = ss.getSheets();
    var holderArray = [];
    for (var x = 0; x < sheets.length; x++) {
        var sheetname = sheets[x].getName();
        if (sheetname != 'Access' && sheetname != 'Home') {
            holderArray.push(sheetname);
        }
    }
    htmlTemplate.data = {
        content: holderArray
        , home: findDataHome()
    }
    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    return html;
}

function popup() {
    var htmlTemplate = HtmlService.createTemplateFromFile('index');
    var ss = SpreadsheetApp.openById('1-6mzNSLtjoaFFbIKEhhVsocDfQELhcbNTE70VwxqVB4');
    var sheets = ss.getSheets();
    var holderArray = [];
    for (var x = 0; x < sheets.length; x++) {
        var sheetname = sheets[x].getName();
        if (sheetname != 'Access' && sheetname != 'Home') {
            holderArray.push(sheetname);
        }
    }
    htmlTemplate.data = {
        content: holderArray
        , home: findDataHome()
    }
    var html = htmlTemplate.evaluate().setWidth(600).setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(html, 'My Portal');
}

function findName(e) {
    var ss = SpreadsheetApp.openById('1-6mzNSLtjoaFFbIKEhhVsocDfQELhcbNTE70VwxqVB4');
    var sheet = ss.getSheetByName('Access');
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    var response = {
        valid: false
        , access: 0
    }
    for (var x = 0; x < data.length; x++) {
        if (data[x][0] == e) {
            response = {
                valid: true
                , access: data[x][1]
            }
        }
    }
    return response;
}

function eOutput(data) {
    var ss = SpreadsheetApp.openById('1-6mzNSLtjoaFFbIKEhhVsocDfQELhcbNTE70VwxqVB4');
    var sheetname = data.project;
    var message = '';
    var success = false;
    var dataout = {};
    var checkmail = findName(data.email);
    var sheet = ss.getSheetByName(sheetname);
    if (!checkmail.valid) {
        message = 'Not valid email';
    }
    if (sheet == null) {
        message = 'Sheet not found';
    }
    if (message == '') {
        //they might have access
        var lookup = parseInt(sheetname.substr(-1));
        var enterUser = false;
        if (checkmail['access'] == 'All') {
            enterUser = true;
        }
        else {
            var res = JSON.parse("[" + checkmail['access'] + "]");
            if (isInArray(res, lookup) && enterUser != true) {
                enterUser = true;
            }
        }
        if (enterUser) {
            message = 'Sheet found';
            success = true;
            dataout = sheet.getRange(1, 1, sheet.getLastRow(), 3).getValues();
        }
        else {
            message = 'You don\'t have access to this page.';
        }
    }
    var response = {
        success: success
        , message: message
        , data: dataout
        , checkmail: checkmail
    }
    return response;
}

function isInArray(array, search) {
    return array.indexOf(search) >= 0;
}

function findDataHome() {
    var ss = SpreadsheetApp.openById('1-6mzNSLtjoaFFbIKEhhVsocDfQELhcbNTE70VwxqVB4');
    var sheet = ss.getSheetByName('Home');
    var datahome = sheet.getRange(1, 1, sheet.getLastRow(), 2).getValues();
    return datahome;
}