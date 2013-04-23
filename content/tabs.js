$(window).bind('load',function() {
    var $browser = $('#v_sidebrowser'),
        $title = $('#v_title_label'),
        appPath = 'chrome://V+/content/';
    $('.icon').click(function(i,d) {
        var $self = $(this);
        var src = $self.attr('link');
        var title = $self.attr('title');
        $title.attr('value',title);
        $self.addClass('sel').siblings().removeClass('sel');
        //一定刷新
        $browser.attr('src','').attr('src',appPath + src + '.xul');
    });
});
