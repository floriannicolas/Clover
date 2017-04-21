var fs = require('fs');
var tmp_name = 'clover_tmp_name_';

function addFile(path, name) {
    var extension = name.substr((name.lastIndexOf('.') + 1));
    var emptypath = path.replace(name, '');
    var response = '<div class="main-file" data-tmpname="'+tmp_name+'" data-emptypath="' + emptypath + '" data-path="' + path + '" data-name="' + name + '" data-extension="' + extension + '">';
    response += '<span class="drag"></span>';
    response += '<span class="title" title="' + name + '">' + name + '</span>';
    response += '<span class="cross"></span>';
    response += '</div>';
    $('.content-main-file').append(response);
    $('.bottom-action').addClass('active');
    $('#main').removeClass('empty');
}

function pad(str) {
    var max = Math.ceil($('.content-main-file .main-file').length / 10);
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function init() {
    var prefix = (localStorage.getItem('clover_prefix')) ? localStorage.getItem('clover_prefix') : "Game of Thrones - S01EP";
    var suffix = (localStorage.getItem('clover_suffix')) ? localStorage.getItem('clover_suffix') : " - 720p";
    $('#clover_prefix').val(prefix);
    $('#clover_suffix').val(suffix);
}

function save() {
    localStorage.setItem('clover_prefix', $('#clover_prefix').val());
    localStorage.setItem('clover_suffix', $('#clover_suffix').val());
}



function renameFiles() {
    console.log('clover');
    var i = 1;
    var prefix = $('#clover_prefix').val();
    var suffix = $('#clover_suffix').val();
    $('.content-main-file .main-file').each(function () {
        var path = $(this).attr('data-path');
        var newtitle = $(this).attr('data-tmpname') + pad("0" + i);
        var newpath = $(this).attr('data-emptypath') + newtitle + "." + $(this).attr('data-extension');
        fs.rename(path, newpath, function (err) {
            if (err) {
                console.log('ERROR: ' + err);
            }
        });
        i++;
    });
    i = 1;
    $('.content-main-file .main-file').each(function () {
        var path = $(this).attr('data-emptypath') + $(this).attr('data-tmpname') + pad("0" + i) + "."  + $(this).attr('data-extension');
        var newtitle = prefix + pad("0" + i) + suffix;
        var newpath = $(this).attr('data-emptypath') + newtitle + "." + $(this).attr('data-extension');
        fs.rename(path, newpath, function (err) {
            if (err) {
                console.log('ERROR: ' + err);
            }
        });
        i++;
    });
    $('.content-main-file .main-file').hide('fade');
    $('.bottom-action').addClass('succeed');
    save();
    setTimeout(function () {
        $('.content-main-file').html('');
        $('.bottom-action').removeClass('active').delay(500).removeClass('succeed');
        $('#main').addClass('empty');

    }, 2000);
}


$(document).ready(function () {
    init();

    $(".content-main-file").sortable({
        axis: "y",
        connectWith: ".main-file",
        handle: ".drag",
        placeholder: "main-file-placeholder ui-corner-all"
    });

    $(document).on('click', '.main-file span.cross', function () {
        $(this).parent().remove();
        if ($('.main-file').length == 0) {
            $('.bottom-action').removeClass('active');
            $('#main').addClass('empty');
        }
    });


    $(document).on('dragenter', '#main', function () {
        $(this).addClass('uploading');
        return false;
    });

    $(document).on('dragover', '#main', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('uploading');
        return false;
    });

    $(document).on('dragleave', '#main', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('uploading');
        return false;
    });

    $(document).on('drop', '#main', function (e) {
        if (e.originalEvent.dataTransfer) {
            if (e.originalEvent.dataTransfer.files.length) {
                // Stop the propagation of the event
                e.preventDefault();
                e.stopPropagation();
                $(this).addClass('uploading');
                for (var i = 0; i < (e.originalEvent.dataTransfer.files).length; i++) {
                    var the_file = e.originalEvent.dataTransfer.files[i];
                    var the_path = the_file.path;
                    addFile(the_path, the_file.name);
                }
                $(this).removeClass('uploading');
            }
        }
        else {
            $(this).removeClass('uploading');
        }
        return false;
    });


    $('.upload_input').change(function (e) {
        var myFiles = $(this)[0].files;
        console.log(myFiles);
        for (i = 0; i < myFiles.length; i++) {
            console.log(myFiles[i]);
            var the_path = myFiles[i].path;
            addFile(the_path, myFiles[i].name);
        }
    });

    $('#clover-form').submit(function(){
        if ($('.main-file').length == 0) {
            alert('Please add file(s) to rename');
        } else if ($('#clover_prefix').val() == "" && $('#clover_suffix').val() == "") {
            alert('Please add file(s) to rename');
        } else {
            renameFiles();
        }
        return false;
    });


    $('.button-action.rename').click(function () {
        if ($('.main-file').length == 0) {
            alert('Please add file(s) to rename');
        } else if ($('#clover_prefix').val() == "" && $('#clover_suffix').val() == "") {
            alert('Please add file(s) to rename');
        } else {
            renameFiles();
        }
        return false;
    });

});