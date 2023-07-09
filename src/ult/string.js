module.exports = {
    removeToneVietNamese: function stringToSlug(str) {
        // remove accents
        var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
            to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(RegExp(from[i], 'gi'), to[i]);
        }

        str = str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\-]/g, '-')
            .replace(/-+/g, '-');

        return str;
    },
    getID: function (length) {
        length = length || 12;
        length = length < 6 ? 6 : length > 30 ? 30 : length;
        var char = 'abcdefghijklmnopqrstuvwxyz0123456789ASDFGHJKLQWERTYUIOPZXCVBNM';
        var id = '';
        while (id.length < length) {
            id += char[Math.floor(Math.random() * char.length)];
        }
        return id;
    },
    getD: function () {
        var date = new Date();
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        var d = '' + fullYear + month + day;
        return d;
    },
    getTimeUTC7: function (time) {
        var date = new Date(time);
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        var d = day + '/' + month + '/' + fullYear;
        var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var t = h + ':' + m;
        return {
            day: d,
            time: t,
        };
    },
};
