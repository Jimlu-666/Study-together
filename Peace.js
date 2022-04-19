auto.waitFor();

importClass(Packages.android.graphics.drawable.GradientDrawable);
importClass(Packages.android.graphics.LinearGradient);
importClass(Packages.android.graphics.Shader);
importClass(Packages.android.graphics.Paint);
importClass(Packages.android.graphics.drawable.LayerDrawable);
var shape = {};

/**
 * android  dp值转换为像素值
 */
function dp2px(context, value) {
    if (value <= 0) {
        return 0;
    }
    var density = context.getResources().getDisplayMetrics().density;
    return value * density + 0.5;
}

/**
 * 返回一个 int 数组
 */
function toJavaIntArray(arr) {
    var javaArr = util.java.array("int", arr.length);
    for (var i = 0; i < arr.length; i++) {
        javaArr[i] = arr[i];
    }
    return javaArr;
}
/**
 * 返回一个 float 数组
 */
function toJavaFloatArray(arr) {
    var javaArr = util.java.array("float", arr.length);
    for (var i = 0; i < arr.length; i++) {
        javaArr[i] = arr[i];
    }
    return javaArr;
}
//渐变方向
var orientationMap = {
    top_bottom: android.graphics.drawable.GradientDrawable.Orientation.TOP_BOTTOM,
    tr_bl: android.graphics.drawable.GradientDrawable.Orientation.TR_BL,
    right_left: android.graphics.drawable.GradientDrawable.Orientation.RIGHT_LEFT,
    br_tl: android.graphics.drawable.GradientDrawable.Orientation.BR_TL,
    bottom_top: android.graphics.drawable.GradientDrawable.Orientation.BOTTOM_TOP,
    bl_tr: android.graphics.drawable.GradientDrawable.Orientation.BL_TR,
    left_right: android.graphics.drawable.GradientDrawable.Orientation.LEFT_RIGHT,
    tl_br: android.graphics.drawable.GradientDrawable.Orientation.TL_BR
};

/**
 * 控件描边、渐变、虚线对象
 */
function JsGradientDrawable(context) {
    JsGradientDrawable.context = context;
    JsGradientDrawable.cornerRadius = 0;
    JsGradientDrawable.strokeWidth = 0;
    JsGradientDrawable.strokeColor = -1;
    JsGradientDrawable.strokeDashWidth = 0;
    JsGradientDrawable.strokeDashGap = 0;
    JsGradientDrawable.color = -1;
    JsGradientDrawable.colors = [];
    JsGradientDrawable.orientation = android.graphics.drawable.GradientDrawable.Orientation.TOP_BOTTOM;
    JsGradientDrawable.radiusii = [];
    //设置圆角
    JsGradientDrawable.prototype.setCornerRadius = function (radius) {
        JsGradientDrawable.cornerRadius = dp2px(JsGradientDrawable.context, radius);
        return this;
    }
    //设置描边宽度
    JsGradientDrawable.prototype.setStrokeWidth = function (width) {
        JsGradientDrawable.strokeWidth = dp2px(JsGradientDrawable.context, width);
        return this;
    }
    //设置秒变颜色
    JsGradientDrawable.prototype.setStrokeColor = function (strokeColor) {
        JsGradientDrawable.strokeColor = colors.parseColor(strokeColor);
        return this;
    }
    //设置描边长度
    JsGradientDrawable.prototype.setStrokeDashWidth = function (dashWidth) {
        JsGradientDrawable.strokeDashWidth = dp2px(JsGradientDrawable.context, dashWidth);
        return this;
    }
    //设置虚线之间的距离， 为0即为实线
    JsGradientDrawable.prototype.setStrokeDashGap = function (dashGap) {
        JsGradientDrawable.strokeDashGap = dp2px(JsGradientDrawable.context, dashGap);
        return this;
    }
    //设置填充色
    JsGradientDrawable.prototype.setColor = function (color) {
        if (color != undefined && !color.equals("")) {
            JsGradientDrawable.color = colors.parseColor(color);
        }
        return this;
    }
    //设置渐变填充色, 填充色与渐变填充色都设置的话， 优先使用渐变填充色
    JsGradientDrawable.prototype.setColors = function (colorsVal) {
        colorsVal.forEach(function (c) {
            JsGradientDrawable.colors.push(colors.parseColor(c));
        });
        return this;
    }

    //设置渐变方向，默认 上下渐变
    JsGradientDrawable.prototype.setOrientation = function (orientation) {
        var iori = orientationMap[orientation];
        if (iori == undefined) {
            iori = android.graphics.drawable.GradientDrawable.Orientation.TOP_BOTTOM;
        }
        JsGradientDrawable.orientation = iori;
        return this;
    }

    /**
     * 指定控件位置的圆角
     * 参数为数组， 且 数组长度必须 大于或等于 8
     * arr[0] 控件左上 x方向的圆角
     * arr[1] 控件左上 y方向的圆角
     * 
     * arr[2] 控件右上 x方向的圆角
     * arr[3] 控件右上 y方向的圆角
     * 
     * arr[4] 控件右下 x方向的圆角
     * arr[5] 控件右下 y方向的圆角
     * 
     * arr[6] 控件左下 x方向的圆角
     * arr[7] 控件左下 y方向的圆角
     */
    JsGradientDrawable.prototype.setCornerRadii = function (arr) {
        if (arr != undefined && arr != null) {
            if (arr.length < 8) {
                console.log("数组长度必须大于或等于8个");
            }
            else {
                arr.forEach(function (radius) {
                    JsGradientDrawable.radiusii.push(dp2px(JsGradientDrawable.context, radius));
                });
            }
        }
        return this;
    }

    /**
     * 新增多个 ui 控件 设置同一样式
     */
    JsGradientDrawable.prototype.intos = function (views) {
        for (let index = 0; index < views.length; index++) {
            this.into(views[index]);
        }
    }

    //给ui 设置样式
    JsGradientDrawable.prototype.into = function (view) {
        view.setBackground(this.getDrawable());
    }

    // 返回一个 GradientDrawable对象
    JsGradientDrawable.prototype.getDrawable = function () {
        var drawable = new GradientDrawable();
        drawable.setCornerRadius(JsGradientDrawable.cornerRadius);
        drawable.setStroke(JsGradientDrawable.strokeWidth, JsGradientDrawable.strokeColor, JsGradientDrawable.strokeDashWidth, JsGradientDrawable.strokeDashGap);
        if (JsGradientDrawable.color != -1) {
            drawable.setColor(JsGradientDrawable.color);
        }
        if (JsGradientDrawable.colors != null && JsGradientDrawable.colors.length > 0) {
            drawable.setColors(toJavaIntArray(JsGradientDrawable.colors));
        }
        drawable.setOrientation(JsGradientDrawable.orientation);
        if (JsGradientDrawable.radiusii != null && JsGradientDrawable.radiusii.length > 0) {
            drawable.setCornerRadii(toJavaFloatArray(JsGradientDrawable.radiusii));
        }
        drawable.setDither(true);//仿抖动
        return drawable;
    }
}

/**
 * 文字渐变对象
 */
function TextColors() {
    //渐变颜色数组
    TextColors.colors = [];
    //设置颜色数组
    TextColors.prototype.setColors = function (colorsVal) {
        colorsVal.forEach(function (c) {
            TextColors.colors.push(colors.parseColor(c));
        });
        return this;
    }

    /**
     * 新增多个 ui 控件 设置同一样式
     */
    TextColors.prototype.intos = function (views) {
        for (let index = 0; index < views.length; index++) {
            this.into(views[index]);
        }
    }

    TextColors.prototype.into = function (textView) {
        if (TextColors.colors != null && TextColors.colors.length > 0) {
            let jf = new Packages.java.lang.Float(0);
            var mLinearGradient = new LinearGradient(jf, jf, new Packages.java.lang.Float(textView.getPaint().getTextSize() * textView.getText().length), jf, toJavaIntArray(TextColors.colors), null, Shader.TileMode.CLAMP);
            textView.getPaint().setShader(mLinearGradient);
            textView.invalidate();
        }
    }

}

/**
 * 创建 一条虚线对象
 */
function JsLine(context) {
    JsLine.context = context;
    JsLine.strokeColor = -1;
    JsLine.strokeDashWidth = 0;
    JsLine.strokeDashGap = 0;
    JsLine.prototype.setStrokeColor = function (strokeColor) {
        JsLine.strokeColor = strokeColor;
        return this;
    }
    JsLine.prototype.setStrokeDashWidth = function (dashWidth) {
        JsLine.strokeDashWidth = dashWidth;
        return this;
    }
    JsLine.prototype.setStrokeDashGap = function (dashGap) {
        JsLine.strokeDashGap = dashGap;
        return this;
    }

    JsLine.prototype.into = function (view) {
        let params = view.getLayoutParams();
        var drawable = new GradientDrawable();
        let strokeWidth = dp2px(JsLine.context, 2);
        if (params.height == -1 || params.height == -2) {
            params.height = strokeWidth + 2;
            view.setLayoutParams(params);
        } else {
            strokeWidth = params.height - 1;
        }
        drawable.setStroke(strokeWidth, colors.parseColor(JsLine.strokeColor),
            new Packages.java.lang.Float(dp2px(JsLine.context, JsLine.strokeDashWidth)),
            new Packages.java.lang.Float(dp2px(JsLine.context, JsLine.strokeDashGap)));
        drawable.setShape(GradientDrawable.LINE);
        view.setLayerType(1, null);
        view.setBackground(drawable);
    }

    /**
    * 新增多个 ui 控件 设置同一样式
    */
    JsLine.prototype.intos = function (views) {
        for (let index = 0; index < views.length; index++) {
            this.into(views[index]);
        }
    }
}

/**
 * 拓展样式:  创建一个 渐变描边样式的 对象
 * 如果 单色描边JsGradientDrawable满足
 * 可使用 这个JsLinearGradient 渐变描边
 */
function JsLinearGradient(context) {
    JsLinearGradient.context = context;
    JsLinearGradient.cornerRadius = 0;
    JsLinearGradient.strokeWidth = 0;
    JsLinearGradient.colors = [];
    JsLinearGradient.background = "#FFFFFF";
    JsLinearGradient.orientation = "top_bottom";
    JsLinearGradient.prototype.setCornerRadius = function (radius) {
        JsLinearGradient.cornerRadius = dp2px(JsLinearGradient.context, radius);
        return this;
    }
    JsLinearGradient.prototype.setStrokeWidth = function (width) {
        JsLinearGradient.strokeWidth = dp2px(JsLinearGradient.context, width);
        return this;
    }
    JsLinearGradient.prototype.setColors = function (colorsVal) {
        colorsVal.forEach(function (c) {
            JsLinearGradient.colors.push(c);
        });
        return this;
    }
    JsLinearGradient.prototype.setOrientation = function (orientation) {
        JsLinearGradient.orientation = orientation;
        return this;
    }
    JsLinearGradient.prototype.setBackground = function (color) {
        JsLinearGradient.background = color;
        return this;
    }
    JsLinearGradient.prototype.into = function (view) {
        var bgDrawable = new JsGradientDrawable(JsLinearGradient.context)
            .setColors(JsLinearGradient.colors)
            .setCornerRadius(JsLinearGradient.cornerRadius)
            .setOrientation(JsLinearGradient.orientation)
            .getDrawable();

        var foreDrawable2 = new JsGradientDrawable(JsLinearGradient.context)
            .setCornerRadius(JsLinearGradient.cornerRadius)
            .setColors(["#FFFFFF", "#FFFFFF"])
            .getDrawable();

        var foreDrawable = new JsGradientDrawable(JsLinearGradient.context)
            .setCornerRadius(JsLinearGradient.cornerRadius)
            .setColor(JsLinearGradient.background)
            .getDrawable();
        var width = JsLinearGradient.strokeWidth;
        var layerDrawable = new LayerDrawable([bgDrawable, foreDrawable2, foreDrawable]);
        layerDrawable.setLayerInset(1, width, width, width, width);
        layerDrawable.setLayerInset(2, width, width, width, width);
        view.setLayerType(1, null);
        view.setBackground(layerDrawable);
    }

    /**
     * 新增多个 ui 控件 设置同一样式
     */
    JsLinearGradient.prototype.intos = function (views) {
        for (let index = 0; index < views.length; index++) {
            this.into(views[index]);
        }
    }
}

shape.withGradientDrawable = function (context) {
    return new JsGradientDrawable(context);
}

shape.withText = function () {
    return new TextColors();
}

shape.withLinearGradient = function (context) {
    return new JsLinearGradient(context);
}

shape.withLine = function (context) {
    return new JsLine(context);
}
const control = createWindow.prototype;
control.viewArr = [];
control.x = device.width/2-300;
control.y = 0;
control.w = 600;
control.h = 400;
control.i = 100;
control.setPosition = function(x, y) {
    this.window.setPosition(x, y);
    this.x = x;
    this.y = y;
}
control.setSize = function(w, h) {
    let time = new Date().getTime();
    if (this.setSizeTime) {
        //设置调整悬浮大小的时间间隔，以免卡顿
        if (time - this.setSizeTime < 50) return false;
    }
    this.setSizeTime = time;
    this.window.setSize(w, h);
    this.w = w;
    this.h = h;
}
control.addView = function(data) {
    let text = data.text || "";
    let color = data.color || "#ffffff";
    if (this.showDate) {
        text = formatDate(new Date()) + data.sign + text;
    } else if (this.showSign) {
        text = data.sign + text;
    }
    ui.run(() => {
        let view = ui.inflate(
            <text layout_gravity="center" padding="0"
                        marginBottom="0px" />, this.window.content, false);
        view.setText(text);
        view.setTextColor(colors.parseColor(color));
        view.setTextSize(this.textSize || 13);
        this.window.content.addView(view);
        this.viewArr.push(view);
        setTimeout(() => {
            //添加完控件后不能立即滚动页面，需要等绘制到页面中后。
            this.window.scroll.fullScroll(android.widget.ScrollView.FOCUS_DOWN);
        }, 50);
        if (this.viewArr.length > (this.i)) this.delView();
    })
}
control.delView = function() {
    if (this.viewArr.length === 0) return false;
    ui.run(() => {
        this.window.content.removeView(this.viewArr.shift());
    });
}
control.clear = function(s) {
    let i = this.viewArr.length;
    let sid = setInterval(() => {
        if (i <= 0) {
            return clearInterval(sid);
        }
        i--;
        this.delView();
    }, s || 20);
}


function createWindow() {
    let window = floaty.rawWindow(
        <frame id="vi" w="*" h="*"  padding="0 0 0 0" >
            <LinearLayout layout_width="match_parent" layout_height="match_parent" orientation="vertical">
                <LinearLayout padding="10 5 10 5" id="bart" bg="#ee000011" w="*" h="auto" margin="0" >
                    <text id="bear" text="log" textColor="#ffffff" layout_weight="1" />
                    <text w="auto" textColor="#FFFFFF" id="exit" text="退出" padding="0" margin="0" />
                </LinearLayout>
                <ScrollView id="scroll" padding="0" margin="0" layout_weight="1">
                    <LinearLayout padding="2 0 2 0" id="content"  orientation="vertical">
                    </LinearLayout>
                </ScrollView>
            </LinearLayout>
        </frame>
    );

    window.exit.on('click', function() {
        window.close();
        toastLog('脚本结束');
        question_list = null;
        exit();
    });
   
    shape.withGradientDrawable(context)
        .setColor("#cc000000")
        .setCornerRadii([20, 20, 20, 20, 20, 20, 20, 20])
        .into(window.vi);
    shape.withGradientDrawable(context)
        .setColors(["#6200ee", "#ef4e4f"])
        .setOrientation("tl_br")
        .setCornerRadius(5);
    shape.withGradientDrawable(context)
        .setCornerRadii([20, 20, 20, 20, 0, 0, 0, 0])
        .into(window.bart);
    shape.withLinearGradient(context)
        .setColors(["#6200ee", "#ef4e4f"])
        .setStrokeWidth(2)
        .setCornerRadius(30)
        .setOrientation("tl_br");
    let control = Object.create(createWindow.prototype);
    control.window = window;
    control.viewArr = [];
    window.setSize(control.w, control.h);
    window.setPosition(control.x, control.y);
    return control;
}

function suur() {
    //绑定events.emitter()
    events.__asEmitter__(this);
    this.control = createWindow();

    bs(this.control.window.bear, () => this.control.x, () => this.control.y, (x, y) => {
        if (x < 0) x = 0;
        if (x > device.width) x = device.width - 1;
        if (y < 0) y = 0;
        if (y > device.height) y = device.height - 1;
        this.control.setPosition(x, y);
        asyncEmit(this, 'bear-move', x, y);
    });
    
    this.control.window.exit.on('click', () => {
        asyncEmit(this, 'close');
    });


    //公开属性
    this.window = this.control.window;
    this.content = this.window.content;
    this.butColse = this.window.exit;
    this.title = this.window.bear;
}
suur.prototype.getContent = function(i) {
    if (i >= 0) {
        return this.control.viewArr[i].text();
    } else if (i < 0) {
        return this.control.viewArr[this.control.viewArr.length + i].text();
    } else {
        return this.control.viewArr.map((v) => v.text());
    }
}
suur.prototype.setMaxContent = function(i) {
    this.control.i = i;
}
suur.prototype.showSign = function(b) {
    this.control.showSign = b;
}
suur.prototype.showDate = function(b) {
    this.control.showDate = b;
}
suur.prototype.setTextSize = function(l) {
    if (!(l>0)) throw new Error('设置字体参数不合法');
    this.control.textSize = l;
}
suur.prototype.close = function() {
    this.control.window.exit.emit('click');
}
suur.prototype.log = function() {
    let text = util.format.apply(util, arguments);
    this.control.addView({
        text: text,
        color: "#ffffff",
        sign: "/D: "
    });
  	console.log(text)
    asyncEmit(this, 'print-log', text);
    asyncEmit(this, 'print', text);
}
suur.prototype.info = function() {
    let text = util.format.apply(util, arguments);
    this.control.addView({
        text: text,
        color: "#64dd17",
        sign: "/I: "
    });
  	console.info(text);
    asyncEmit(this, 'print-info', text);
    asyncEmit(this, 'print', text);
}
suur.prototype.verbose = function() {
    let text = util.format.apply(util, arguments);
    this.control.addView({
        text: text,
        color: "#c8c8c8",
        sign: "/V: "
    });
  	console.log(text);
    asyncEmit(this, 'print-verbose', text);
    asyncEmit(this, 'print', text);
}
suur.prototype.warn = function() {
    let text = util.format.apply(util, arguments);
    this.control.addView({
        text: text,
        color: "#2962ff",
        sign: "/W: "
    });
  	console.warn(text);
    asyncEmit(this, 'print-warn', text);
    asyncEmit(this, 'print', text);
}
suur.prototype.error = function() {
    let text = util.format.apply(util, arguments);
    this.control.addView({
        text: text,
        color: "#d50000",
        sign: "/E: "
    });
  	console.error(text);
    asyncEmit(this, 'print-error', text)
    asyncEmit(this, 'print', text);
}
suur.prototype.clear = function() {
    this.control.clear();
    asyncEmit(this, 'print-clear');
}

suur.prototype.hide = function() {
    if (this.control.hide) return false;
    let h = this.control.y + this.control.h + 200;
    this.control.hide = h;
    h = h / 100;
    let i = 0;
    let sid = setInterval(() => {
        this.control.setPosition(this.control.x, this.control.y - h);
        i++;
        if (i >= 100) {
            asyncEmit(this, 'hide');
            return clearInterval(sid);
        }
    }, 1);
}
suur.prototype.show = function() {
    if (!this.control.hide) return false;
    let h = this.control.hide;
    this.control.hide = undefined;
    h = h / 100;
    let i = 0;
    let sid = setInterval(() => {
        this.control.setPosition(this.control.x, this.control.y + h);
        i++;
        if (i >= 100) {
            asyncEmit(this, 'show');
            return clearInterval(sid);
        }
    }, 1);
}


function bs(view, getWX, getHY, callback) {
    let x, y, x2, y2, time;
    let longClick;
    view.setOnTouchListener(function(view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                x2 = getWX();
                y2 = getHY();
                time = new Date().getTime();
                longClick = false;
                return true;
            case event.ACTION_MOVE:
                let time2 = new Date().getTime();
                if (!longClick && time2 > 1500) {
                    longClick = true;
                    view.emit('longClick');
                }
                let x1 = event.getRawX() + x2 - x;
                let y1 = event.getRawY() + y2 - y;
                callback(x1, y1, time2 - time);
                return true;
            case event.ACTION_UP:
                if (new Date().getTime() - time < 100) {
                    view.emit('click');
                }
                return true;
        }
        return true;
    });
}

function asyncEmit(event, eventName) {
    return Promise.resolve()
        .then(() => event.emit.apply(
            event, Array.prototype.slice.call(arguments, 1)))
}

function formatDate(date) {
    let sdf = new java.text.SimpleDateFormat('HH:mm:ss');
    return sdf.format(date);
}
setInterval(() => {}, 1000);
let s = new suur;
s.on('close', function() {
    exit();
});
s.setMaxContent(6); //设置储存条目数，默认100
s.showDate(true); //设置显示时间
s.showSign(true); //设置显示标志
s.setTextSize(12); //设置文字大小

//获取日志框内容，-1表示最后一条，0为第一条
// s.getContent(-1);
// 以上为 autojsPro 代码商城开源代码 -> 悬浮控制台 作者：@selp
////////////////////////////////////////////////////////////

/**
 * @description: 视频学习秒数
 */
var video_s = 6;

/**
 * @description: 文章学习秒数
 */
var article_s = 45;

/**
 * @description: 文章学习篇数
 */
var article_num = 0;

/**
 * @description: 视频学习篇数
 */
var video_num = 0;

/**
 * @description: 每日答题次数
 */
var daily_num = 0;

/**
 * @description: 每周答题次数
 */
var week_num = 0;

/**
 * @description: 专项答题次数
 */
var special_num = 0;

/**
 * @description: 挑战答题次数
 */
var challenge_num = 0;

/**
 * @description: 四人赛答题次数
 */
var four_num = 0;

/**
 * @description: 双人人赛答题次数
 */
var double_num = 0;

/**
 * @description: 订阅次数
 */
var sub_num = 0;

/**
 * @description: 分享次数
 */
var share_num = 0;

/**
 * @description: 评论观点次数
 */
var standpoint_num = 0;

/**
 * @description: 本地频道
 */
var local_num = 0;

/**
 * @description: 四人双人延迟时间
 */
var delay_time = 0;

/**
 * @description: 本地题库存储
 */
 var storage1 = storages.create('Twelve:question');

 /**
  * @description: 本地文字识别内容对应题库
  */
  var storage2 = storages.create('Twelve:local');
 /**
  * @description: 题库列表
  */
 var question_list = [];

/**
 * @description: 题是否为读音字形
 */
 var yinzi = false;

 /**
  * @description: 是否第一题
  */
 var first = true;

 /**
  * @description: 四人/双人 记录当前题目
  */
 var old_q = '';

 /**
  * @description: 四人/双人 记录当前题目答案
  */
 var old_ans = '';



/**
 * @description: 随机延迟
 * @param: seconds-延迟秒数a
 */
function delay(a){
    sleep(a*1000+Math.random()*1000);
}
/**
 * @description: 得到各项次数
 */
function get_all_num(){
    s.info('正在获取分数情况');
    var score_id = id('comm_head_xuexi_score').findOne(5000);
    score_id.click();
    text('登录').waitFor();
    delay(1);
    var score = {};
    var list_view = className("android.widget.ListView").findOne(5000);
    for(var i = 0;i<list_view.childCount();i++){
        var son = list_view.child(i);
        try {
            var names = son.child(0).child(0).text();
        } catch (e) {
            var names = son.child(0).text();
        }
        var s = son.child(2).text().split("/")[0].match(/[0-9][0-9]*/g);
        score[names] = Number(s);
    }
    video_num = 6-score['视听学习'];
    article_num = Math.ceil((12-score['我要选读文章'])/2);
    daily_num = (5-score['每日答题'])?1:0;
    week_num = score['每周答题']?0:1;
    special_num = score['专项答题']?0:1;
    challenge_num = (6-score['挑战答题'])?1:0;
    four_num = score['四人赛']?0:1;
    double_num = score['双人对战']?0:1;
    sub_num = 2 - score['订阅'];
    standpoint_num = 1-score['发表观点'];
    local_num = 1 - score['本地频道'];
    share_num = score['分享']?0:2;
    back();
    s.info('获取完成');
    delay(2);
}
var article_list = [];
/**
 * @description: 已读文章判断
 * @param: 文章名字 X 
 */
function article_check(x){
    for(var i = 0;i<article_list.length;i++){
        if(article_list[i] == x) return true;
    }
    article_list.push(x);
    return false;
}
var commits = ['富强、民主、文明、和谐','自由、平等、公正、法治','爱国、敬业、诚信、友善','弘扬社会主义核心价值观'];
/**
 * @description: 文章学习
 * @param: 第xxx次学习
 */
function study_article(xxx){
    if(article_num==0) return;
    s.info('正在文章学习');
    back_table();
    delay(2);
    if(xxx){
        desc('工作').click();
        delay(2);
        click('推荐');
    }
    s.warn('还需要学习'+article_num+'篇文章');
    var x = 0;
    while(article_num>0){
        var b = text('播报').findOnce(x);
        if(b){
            var names =  b.parent().parent().parent().child(0).text();
            if(!article_check(names)){
                delay(1);
                var tmp = b.parent().parent().parent().child(0).parent().parent().click();
                if(!tmp){
                    x++;
                    continue;
                }
                delay(3);
                var show = textContains('2022 年').findOne(10);
                if(!show){s.warn('没有加载出文章，返回');}
                else{
                    var t = article_s+Math.floor(Math.random()*5+1);
                    s.info('当前第'+(7-article_num)+'篇文章,本篇文章学习'+t+'s');
                    for(var i = 0 ; i < t;){
                        sleep(1000);
                        while(!textContains("欢迎发表你的观点").exists()){
                            s.error('已离开文章界面');
                            delay(5);
                        }
                        var tmp = Math.random();
                        if(tmp>0.9){
                            swipe(device.width/2+Math.random()*100,3*device.height/4+Math.random()*100,device.width/2-Math.random()*100,device.height/4,Math.random()*1000);
                        }else if(tmp < 0.1){
                            swipe(device.width/2-Math.random()*100,device.height/4+Math.random()*100,device.width/2,3*device.height/4-Math.random()*100,Math.random()*1000);
                        }
                        i++;
                        if(i%5==0){
                            s.log('已经学习文章'+i+'s');
                        }
                    }
                    article_num--;
                    if(standpoint_num>0){
                        s.info('开始发表观点');
                        standpoint_num--;
                        text('欢迎发表你的观点').click();
                        delay(1);
                        try{
                            var commit = text('观点').findOne().parent().parent().child(2).child(1).child(0).text();
                        }catch(e){
                            var commit = randomNum(0,commits.length-1);
                        }
                        setText(commit);
                        delay(1);
                        click("发布");
                        delay(2);
                        click("删除");
                        delay(2);
                        click("确认");
                        s.info('开始发表观点');
                    }
                    if(share_num>0){
                        s.info('开始分享');
                        share_num--;
                        className('ImageView').depth(10).drawingOrder(4).click();
                        delay(1);
                        click("分享到学习强国");
                        delay(1);
                        back();
                    }
                }
                back();delay(2);
            }
            x++;
        }
        else{
            x = 0;
            className("ListView").scrollForward();
            delay(2);
        }
    }
    s.info('文章学习完成');
}
/**
 * @description: 本地频道
 */
function local_(){
    if(local_num == 0) return;
    s.info('开始本地频道');
    back_table();
    desc('工作').click();
    delay(2);
    text("要闻").findOne().parent().parent().child(3).click();
    delay(2);
    className("android.support.v7.widget.RecyclerView").findOne().child(0).click();
    delay(2);
    back();
    s.info('本地频道完成');
}
/**
 * @description: 视频学习
 */
function study_video(){
    if(video_num == 0) return;
    s.info('正在视频学习');
    back_table();
    s.warn('还需学习'+(video_num)+'篇视频');
    delay(2);
    click('百灵');
    delay(2);
    click('推荐');
    delay(2);
    var x = 0;
    while(video_num>0){
        s.info('当前第'+(7-video_num)+'篇');
        delay(2);
        className('android.widget.FrameLayout').clickable(true).depth(22).findOnce((x % 2)).click();
        delay(2);
        x++;
        for(var i = 0 ;i<video_s+random(0,5);){
            sleep(1000);
            while(!text('播放').exists()){
                s.error('已离开视频界面');
                delay(5);
            }
            i++;
            s.log('已经学习视频'+i+'s');
        }
        back();
        video_num --;
        if(x == 2){
            delay(2);
            click('推荐');
            delay(2);
            x = 0;
        }
    }
    s.info('视频学习完成');
}
/**
 * @description: 每日答题 - 单题
 */
function click_daily(){
    var xxxxxxxxxx = '';
    var click_true = false;
    text("查看提示").findOne().click();
    var tips = text("提示").findOne().parent().parent().child(1).child(0).text();
    delay(1);
    back();
    delay(1);
    if(textContains('选题').exists()){
        className("ListView").findOne().children().forEach(option=>{
            if(tips.indexOf(option.child(0).child(2).text())!=-1){
                xxxxxxxxxx+=option.child(0).child(2).text();
                option.child(0).click();
                click_true = true;
            }
        })
        if(click_true == false){
            className("ListView").findOne().child(0).child(0).click();
        }
        s.log('答案:'+xxxxxxxxxx);
    }
    else{
        var q_list = [];
        var space_num = [];
        className("EditText").findOnce().parent().parent().children().forEach(item => {
            if(item.childCount() == 0){
                q_list.push(item.text());
            }
            else{
                q_list.push('@'+(item.childCount()-1));
                space_num.push((item.childCount()-1));
            }
        })
        var ans = '';
        for(var i = 1 ; i <q_list.length-1;i++){
            if(q_list[i][0]=='@'){
                var ss = q_list[i-1].substr(Math.max(0, q_list[i - 1].length - 5), 5);
                var aaa = tips.indexOf(ss) + ss.length;
                var aaaa = tips.substr(aaa, Number(q_list[i][1]));
                ans += aaaa;
            }
        }
        if(ans==''){ans = "没有找到答案！！！"}
        s.log('答案:'+ans);
        setText(0, ans.substr(0, space_num[0]));
        if (space_num.length > 1) {
            for (var i = 1; i < space_num.length; i++) {
                setText(i, ans.substr(space_num[i - 1], space_num[i]));
            }
        }
    }
    text('确定').findOne().click();
    delay(0.5);
    if(text('下一题').exists()){
        click('下一题');
    }
    if(text('完成').exists()){
        click('完成');
    }
    delay(1);
}
/**
 * @description: 每日答题
 */
function daily_Answer(){
    if(daily_num == 0) return;
    s.info('开始每日答题');
    delay(1);
    text('每日答题').findOne().parent().click();
    delay(3);
    while(true){
        click_daily();
        if(text("再来一组").exists()){
            delay(3);
            if (!text("领取奖励已达今日上限").exists()) {
                s.warn('积分未满，再答一次');
                text("再来一组").click();
            }else {
                text("返回").click();
                delay(2);
                break;
            }
        }
    }
    s.info('每日答题结束');
}
/**
 * @description: 挑战 单题答题
 */
function challenge_loop(x){
    if(x>5){
        s.info('答题次数已满，随机点击');
        var tmp = className("ListView").findOne().childCount();
        className("ListView").findOne().child(random(0,tmp-1)).child(0).child(0).click();
    }
    else{
        var question = className("ListView").findOnce().parent().child(0).text();
        var similars = 0;
        var answer = '';
        for(var i = 0 ; i<question_list.length;i++){
            var tmp = similarity(question_list[i][1],'',question,false);
            if(tmp>similars){
                similars = tmp;
                answer = question_list[i][0];
            }
        }
        s.log('答案：'+answer);
        var click_true = false;
        className("ListView").findOne().children().forEach(option=>{
            ans = option.child(0).child(1).text();
            if(ans == answer){
                option.child(0).child(0).click();
                click_true = true;
            }
        })
        if(!click_true) className("ListView").findOne().child(0).child(0).child(0).click();
    }
}
/**
 * @description: 题目相似的查询
 * @param: question-题库题目，answer-题库答案，q文字识别内容，flag-字音
 */
function similarity(question,answer, q,flag) {
    var num = 0;
    if(flag){
        if(question.indexOf('正确')==-1 && question.indexOf('下列不属于二十四史的')==-1){
            return 0;
        }
        for(var i = 0;i<q.length;i++){
          if(answer.indexOf(q[i])!=-1){
                num++;
          }
        }
        return num/(answer.length+q.length);
    }
    else{
        var tmp = 1;
        if(q.length>20) tmp = 2;
        if(q.length>40) tmp = 3;
        if(q.length>50) tmp = 4;
        for(var i = 0;i<q.length-tmp;i+=tmp){
            if(question.indexOf(q[i]+q[i+1])!=-1){
                num++;
            }
        }
        return num/(question.length+q.length);
    }
}
/**
 * @description: 挑战答题
 */
function challenge(){
    if(challenge_num == 0) return;
    s.info('点击挑战答题');
    delay(3);
    text("排行榜").findOnce().parent().child(10).click();
    var xxxxx = 1;
    while(true){
        delay(3);
        challenge_loop(xxxxx);
        delay(0.5);
        if (text('wrong@3x.9ccb997c').exists() || text('2kNFBadJuqbAAAAAElFTkSuQmCC').exists() || text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" + "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists()){
            text('结束本局').findOne().click();
            if(xxxxx>=6){
                text('再来一局').waitFor();
                back();
                break;
            }
            else{
                click('再来一局');
                delay(5);
            }
            xxxxx = 0;
        }
        else{xxxxx++;}
    }
    s.info('挑战答题结束');
}
/**
 * @description: 题库提取到questi_list
 */
function init_question_list(){
    try{
        var length = http.get('https://gitee.com/lctwelve/Peace/raw/master/length').body.string();
        if(length.indexOf('?V')!=-1)
        if(!storage1.get(0)||storage1.get(0)!=length){
            s.info('题库有更新，更新题库中');
            var tiku = http.get('https://gitee.com/lctwelve/Peace/raw/master/question.txt').body.string();
            tiku = tiku.split('\n');
            storage1.clear();
            for(var i = 0 ;i<tiku.length;i++){
                var x = i+1;
                var q = tiku[i].split('=');
                storage1.put(x,q);
            }
            storage1.put(0,length);
            s.info('题库更新完成');
            tiku = null;
        }
    }catch(e){
        s.error('题库更新失败');
    }
    length = Number(storage1.get(0).split('?')[0]);
    for(var i = 1 ; i<=length;i++){
        question_list.push(storage1.get(i));
    }
    length = null;
}
/**
 * @description: 四人/双人对战
 * @param: null
 * @return: null
 */
function zsyAnswer() {
    s.info('开始对战');
    var img = captureScreen();
    try{
        var point = findColor(img, '#1B1F25', {
            region: [0, 0, 100, 100],
            threshold: 10,
        });
    }catch(e){
        console.error(e);
        s.info('你可能使用了模拟器并且hamibot的版本是1.3.0及以上，请使用hamibot1.1.0版本');
        exit();
    }
    // init();
    if (choose == 'a') {
        huawei_ocr_api(img);
    } else if (choose == 'b') {
        ocr_api(img);
    } else if (choose == 'c') {
        hamibot_ocr_api(img);
    }
    else baidu_ocr_api(img);
    var count = 2;
    for (var i = 0; i < count; i++) {
        delay(2);
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne(3000).parent().child(0).click();
            s.log("点击随机匹配");
            count = 1;
        } else {
            s.log("点击开始比赛");
            // my_click_clickable('开始比赛');
            var sx = text("开始比赛").findOne(5000);
            if(sx){
                sx.click();
            }
            else{
                s.log('没有找到开始比赛，点击随机匹配');
                text("随机匹配").findOne(3000).parent().child(0).click();
                count = 1;
            }
        }
        first = true;
        yinzi = false;
        delay(1);
        if (text('知道了').exists()) {
            s.warn('答题已满');
            text('知道了').findOnce().click();
            delay(2);
            if(text("随机匹配").exists()||text("开始比赛").exists()){
                break;
            }else return 0;
        }
        className("ListView").waitFor();
        var range = className("ListView").findOnce().parent().bounds();
        var x = range.left + 20,
            dx = range.right - x-20;
        var y = range.top,
            dy = device.height - 300 - y;
        log('坐标获取完成');
        
        while (!text('继续挑战').exists()) {
            do {
                img = captureScreen();
                var point = findColor(img, '#1B1F25', {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
                // console.log("等待题目显示");
            } while (!point);
            console.time('答题');
            try{
                range = className("ListView").findOnce().parent().bounds();
                // if (choose == 'a') img = images.inRange(img, '#000000', '#444444');
                if(!first && !yinzi)
                    img = images.clip(img, x, y, dx, (range.bottom-y)/3);
                else
                    img = images.clip(img, x, y, dx, range.bottom-y);
            }
            catch(e){
                img = images.clip(img, x, y, dx, dy);
            }
            // images.save(img, "/sdcard/题目"+xxx+".jpg", "jpg", 50);
            // xxx++;
            var question;
            if (choose == 'a') {    // 文字识别
                if(!first && !yinzi)
                    img = images.inRange(img, '#000000', '#444444');
                question = huawei_ocr_api(img);
            } else if (choose == 'b') {
                question = ocr_api(img);
            } else if (choose == 'c') {
                if(!first && !yinzi)      // 第一题不变色
                    img = images.inRange(img, '#000000', '#444444');
                question = hamibot_ocr_api(img);
            }
            else{
                if(!first && !yinzi)
                    img = images.inRange(img, '#000000', '#444444');
                question = baidu_ocr_api(img);
            }
            question = question.slice(question.indexOf('.') + 1);
            question = question.replace(/,/g, "，");
            s.log(question);
            if (question) {
                var c = do_contest_answer(32, question);
                if (c == -1) {
                    break;
                } else if (c == -2) {
                    className('android.widget.RadioButton').waitFor();
                    continue;
                }
            } else {
                images.save(img, "/sdcard/截图.jpg", "jpg", 50);
                console.error("没有识别出任何内容，为了查错已经将截图保存在根目录./截图.jpg，如果截图正常并使用的是本地ocr，那么当前你的手机可能并不适配该ocr，百度/华为ocr则检查扣费次数情况");
                console.log('截图坐标为(' + x + ',' + y + '),(' + dx + ',' + dy + ')');
                break;
            }
            console.timeEnd('答题');
            img.recycle();
            var q_right = true;
            do {
                img = captureScreen();
                var point = findColor(img, '#fff64e75', {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
                if(point&&q_right){
                    q_right = false;
                }
                point = findColor(img, '#555AB6', {
                    region: [x, y, dx, dy],
                    threshold: 10,
                });
            } while (!point);
            if(q_right == true){    // 如果当前题目正确
                storage2.put(old_q,old_ans);    // 存入本地存储，减小下一次搜该题的时间
            }
            s.log('----------');
            yinzi = false;
        }
        if (i == 0 && count == 2) {
            delay(1)
            s.log('第二轮答题开始');
            while (!click('继续挑战'));
            delay(1);
        }
    }
    if(hamibot.env.another){
        var x = hamibot.env.another*1;
    }  
    else{
        var x = 0;
    } 
    while(x>0){
        s.info('额外的 '+ x +' 轮即将开始!');
        x--;
        delay(2);
        click('继续挑战');
        delay(3);
        if (text("随机匹配").exists()) {
            text("随机匹配").findOne().parent().child(0).click();
            s.log("点击随机匹配");
        } else {
            s.log("点击开始比赛");
            // my_click_clickable('开始比赛');
            var sx = text("开始比赛").findOne(5000);
            if(sx){
                sx.click();
            }
            else{
                s.log('没有找到开始比赛，点击随机匹配');
                text("随机匹配").findOne(3000).parent().child(0).click();
            }
        }
        delay(1);
        if (text('知道了').exists()) {
            s.warn('答题已满');
            text('知道了').findOnce().click();
            delay(1);
            return 0;
        }
        while(true){
            if (text('继续挑战').exists()) break;
            while (!className('android.widget.RadioButton').depth(32).exists()) {
                delay(randomNum(3,5));
                if (text('继续挑战').exists()) break;
            }
            delay(2);
            s.warn('随机点击');
            try{
                var t = className("ListView").findOne(5000).childCount();
                t = randomNum(0,t-1);
                className('android.widget.RadioButton').depth(32).findOnce(t).click();
            }
            catch(e){}
            if (text('继续挑战').exists()) break;
            sleep(200);
        }
        // console.warn('额外一轮结束!');
    }
    s.info('答题结束,返回答题界面');
    delay(2);
    back();
    delay(2);
    back();
    if (count == 1) {
        delay(2);
        if (text('退出').exists()) {
            textContains('退出').click();
            delay(1);
        } else {
            s.warn('没有找到退出，按坐标点击(可能失败)\n如果没返回，手动退出双人赛即可继续运行');
            // console.setPosition(device.width * 0.2, device.height * 0.5);
            click(device.width * 0.2, device.height * 0.6);
        }
        delay(2);
    }
}
/**
 * @description: 四人/双人单题答题
 */
function do_contest_answer(depth_option, question1) {
    // console.time('搜题');
    question1 = question1.replace(/'/g, "");
    question1 = question1.replace(/"/g, "");
    old_question = JSON.parse(JSON.stringify(question1));
    question1 = question1.split('来源:')[0]; //去除来源
    question1 = question1.split('来源：')[0]; //去除来源
    question = question1.split('A.')[0];
    // question = question.split('（.*）')[0];
    reg = /下列..正确的是.*/g;
    reb = /选择词语的正确.*/g;
    rea = /选择正确的读音.*/g;
    rec = /下列不属于二十四史的是.*/g;
    var option = 'A';
    var answer = 'N';
    var similars = 0;
    var pos = -1;
    var answers_list = '';
    if (rec.test(question) || reg.test(question) || rea.test(question) || reb.test(question)) {
        yinzi = true;
        first = false;
        try {
            old_question = old_question.replace(/4\./g,'A.');
            var old_answers = old_question.split('A.')[1].split('C')[0];
            for (var k = 0; k < 2; k++) {
                answers = old_answers.split('B.')[k];
                // answers = answers.match(/[\u4e00-\u9fa5]/g).join(""); //剩余汉字
                answers = answers.replace(/哆峻/g, "啰唆");
                answers = answers.replace(/罗峻/g, "罗唆");
                answers = answers.replace(/暖陀/g, "蹉跎");
                answers = answers.replace(/暖跑/g, "蹉跎");
                answers = answers.replace(/跨踏/g, "踌躇");
                answers = answers.replace(/chuo/g, "chuò");
                answers = answers.replace(/cuotuo/g, "cuōtuó");
                answers = answers.replace(/duo/g, "duō");
                answers = answers.replace(/蹈/g, "踌躇");
                answers = answers.replace(/调帐/g, "惆怅");
                answers = answers.replace(/任悔/g, "忏悔");
                answers = answers.replace(/仟悔/g, "忏悔");
                answers = answers.replace(/忧心../g, "忧心忡忡");
                answers = answers.replace(/美轮美./g, "美轮美奂");
                answers = answers.replace(/决穿/g, "诀窍");
                answers = answers.replace(/浙临/g, "濒临");
                answers = answers.replace(/不落../g, "不落窠臼");
                answers = answers.replace(/.目结舌/g, "膛目结舌");
                answers = answers.replace(/泉水../g, "泉水淙淙");
                answers = answers.replace(/饮.止渴/g, "饮鸠止渴");
                answers = answers.replace(/趋之若./g, "趋之若鹜");
                answers = answers.replace(/一.而就/g, "一蹴而就");
                answers = answers.replace(/刚.自用/g, "刚愎自用");
                answers = answers.replace(/风驰电./g, "风驰电掣");
                answers = answers.replace(/不.而走/g, "不胫而走");
                answers = answers.replace(/.声叹气/g, "唉声叹气");
                answers = answers.replace(/.而走险/g, "铤而走险");
                answers = answers.replace(/底护/g, "庇护");
                answers = answers.replace(/蓓./g, "蓓蕾");
                answers = answers.replace(/抵悟/g, "抵牾");
                answers = answers.replace(/情懒/g, "慵懒");
                answers = answers.replace(/差道/g, "差遣");
                answers = answers.replace(/泽炼/g, "淬炼");
                answers = answers.replace(/博奔/g, "博弈");
                answers = answers.replace(/相形见./g, "相形见绌");
                answers = answers.replace(/对.公堂/g, "对簿公堂");
                answers = answers.replace(/疼李/g, "痉挛");
                answers = answers.replace(/痉李/g, "痉挛");
                answers = answers.replace(/..人口/g, "脍炙人口");
                answers = answers.replace(/.意安为/g, "恣意妄为");
                answers = answers.replace(/凌合/g, "凑合");
                answers = answers.replace(/神抵/g, "神祗");
                answers = answers.replace(/叫苦不./g, "叫苦不迭");
                answers = answers.replace(/草.人命/g, "草菅人命");
                answers = answers.replace(/鞭./g, "鞭笞");
                answers = answers.replace(/发物/g, "发轫");
                answers = answers.replace(/..充数/g, "滥芋充数");
                answers = answers.replace(/水蒸气/g, "水蒸气 水蒸汽");
                answers = answers.replace(/..置疑/g, "毋庸置疑");
                answers = answers.replace(/..不振/g, "萎靡不振");
                answers = answers.replace(/瓜熟.落/g, "瓜熟蒂落");
                answers = answers.replace(/虎视../g, "虎视眈眈");
                answers = answers.replace(/进裂/g, "崩裂");
                // try{
                //     answers = r.replace(answers);
                // }catch(e){}
                answers_list += answers;
            }
        } catch (e) {
            while (!className('android.widget.RadioButton').depth(32).exists()) {
                if (text('继续挑战').exists()) return -1;
            }
            return -2;
        };
    }
    if(yinzi) question = answers_list;
    answer = storage2.get(question);
    if(yinzi || !answer){
        for(var i = 0;i<question_list.length;i++){          // 搜题
            // question answer q flag
            var sx = similarity(question_list[i][1],question_list[i][0],question,yinzi);
            if(sx>similars){
                similars = sx;
                pos = i;
            }
            if(sx == 999) break;
        }
        if(pos != -1){
            answer = question_list[pos][0];
        }
        else{
            console.error('没搜到答案,题目异常：\n“'+old_question+'”');
            s.error('此题异常');
        }
    }else{
        s.log('有此题');
    }
    if (answer) {
        old_q = question;
        old_ans = answer;
        s.info('答案:'+answer);
        if(!first && !yinzi){
            while(true) {
                if(className('android.widget.RadioButton').depth(32).exists()){
                    break;
                }
                if (text('继续挑战').exists()) return -1;
            }
            try{
                var img = captureScreen();
                var b = className('ListView').depth(29).findOne(3000).bounds();
                img = images.clip(img, b.left, b.top, b.right-b.left, b.bottom-b.top);
                if (choose == 'a') {    // 文字识别
                    old_question = huawei_ocr_api(img,token);
                } else if (choose == 'b') {
                    old_question = ocr_api(img);
                } else if (choose == 'c') {
                    old_question = hamibot_ocr_api(img,30,false);
                }
                else old_question = baidu_ocr_api(img,token);
                // images.save(img, "/sdcard/选项"+xn+".png", "png", 50);
                // xn++;
                console.log(old_question);
            }
            catch(e){
                console.error(e);
                s.info('选项获取失败');
            }
        }
        try{
            option = click_by_answer(answer,old_question);
            if(!option) option = 'A';
        }
        catch(e){console.error("此题选项异常！！！");console.error(e);}
        console.info('点击选项:' + option);
        if (text('继续挑战').exists()) return -1;
        while (!className("ListView").exists()) {
            // className('android.widget.RadioButton').findOnce(answer[0].charCodeAt(0) - 65).click();
            if (text('继续挑战').exists()) return -1;
        }
        if (text('继续挑战').exists()) return -1;
        if(!first && !yinzi){
            sleep(delay_time);
        }
        first = false;
        try {
            while(!className("ListView").findOne(5000).child(option[0].charCodeAt(0) - 65).child(0).click()){
                if (text('继续挑战').exists()) return -1;
            }
        } catch (e) {
            while (!className('android.widget.RadioButton').depth(depth_option).exists()) {
                if (text('继续挑战').exists()) return -1;
            }
            try{
                className('android.widget.RadioButton').depth(depth_option).findOnce(option[0].charCodeAt(0) - 65).click();
            }catch(e){
                console.error('没找到选项,选A跳过');
                className('android.widget.RadioButton').depth(depth_option).findOnce(0).click();
            }
        }
        return 0;
    }
    try{
        className('android.widget.RadioButton').depth(depth_option).findOnce(0).click();
    }
    catch(e){
        while(!className("ListView").findOne(5000).child(0).child(0).click()){
            if (text('继续挑战').exists()) return -1;
        }
    }
    return 0;
}
var o = ['A.','B.','C.','D.','AAAA'];
var o1 = ['A','B','C','D','AAAA'];
/**
 * @description: 根据答案选择选项
 */
function click_by_answer(ans,question){
    ans = ans.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join("")
  	question = question.replace(/ /g,'');
    question = question.replace(/4\./g,'A.');
    question = question.replace(/:/g,'：');
    try{
        question = r.replace(question);
    }catch(e){}
    // question = question.split('A.');
    question = question.replace(/c\./g,"C.");
    question = question.replace(/，/g,".");

    var sum = 0;
    for(var i = 0 ;i<question.length;i++){
        if(question[i]>='A' && question[i]<='D'){
            sum++;
        }
    }
    var op = [];
    if(sum<=4){
        question = question.replace(/\./g,"");
        for(var i = 0;i<4;i++){
            try{
                var tmp = question.split(o1[i])[1].split(o1[i+1])[0].split('推荐：')[0].split('出题')[0];
                op.push(tmp.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join(""));
            }
            catch(e){
                op.push('&');
            }
        }
    }
    else{
        for(var i = 0;i<4;i++){
            try{
                var tmp = question.split(o[i])[1].split(o[i+1])[0].split('推荐：')[0].split('出题')[0];
                op.push(tmp.match(/[\u4e00-\u9fa5a-zA-Z0-9āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜü]/g).join(""));
            }
            catch(e){
                op.push('&');
            }
        }
    }
    // op[op.length-1] = op[op.length-1].split('推荐')[0].split('出题')[0];
    var s = 0;
    var pos = -1;
    for(var i = 0;i<op.length;i++){
        if(op[i]=='&') continue;
        if(op[i] == ans){
            return o1[i];
        }
        var tmp = similarity_answer(op[i],ans);
        if(tmp>s){
            s = tmp;
            pos = i;
        }
    }
    return o1[pos];
}
/**
 * @description: 选项相似度查询
 */
function similarity_answer(op,ans){
    var num = 0;
    for(var i = 0;i<ans.length;i++){
        if(op.indexOf(ans[i])!=-1) num++;
    }
    for(var i = 0;i<ans.length-1;i++){
        if(op.indexOf(ans[i]+ans[i+1])!=-1) num++;
    }
    for(var i = 0;i<ans.length-2;i++){
        if(op.indexOf(ans[i]+ans[i+1]+ans[i+2])!=-1) num++;
    }
    return num/(2*op.length+2*ans.length);
}
/**
 * @description: 百度文字识别
 * @return: 文字识别内容
 */
function baidu_ocr_api(img) {
    console.log('百度ocr文字识别中');
    var answer = "";
    var res = http.post(
        'https://aip.baidubce.com/rest/2.0/ocr/v1/general',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            access_token: token,
            image: images.toBase64(img),
        }
    );
    
    var res = res.body.json();
    try {
        var words_list = res.words_result;
    } catch (error) {
        console.error('百度ocr文字识别请求错误，可能有以下情况\n1.百度ocr欠费\n2.其他的错误');
        exit();
    }
    for (var i in words_list) {
        answer += words_list[i].words;
    }
    return answer.replace(/\s*/g, "");
}
/**
 * @description: 第三方浩然文字识别
 * @return: 文字识别内容
 */
function ocr_api(img) {
    console.log('第三方本地ocr文字识别中');
    try{
        var answer = "";
        var results = ocr.detect(img.getBitmap(), 1);
        for (var i = 0; i < results.size(); i++) {
            var s = results.get(i).text;
            answer += s;
        }
        // console.info(answer.replace(/\s*/g, ""));
        return answer.replace(/\s*/g, "");
    }catch(e){
        console.error(e);
        console.info("第三方OCR插件安装错了位数，分为64位和32位\n卸载之前的插件，换一个位数安装");
        exit();
    }
}
/**
 * @description: hamibot内置paddle文字识别
 * @return: 文字识别内容
 */
function hamibot_ocr_api() {
    console.log('hamibot文字识别中');
    let list = ocr.recognize(arguments[0])['results']; // 识别文字，并得到results
    let eps = 30; // 坐标误差
    if (arguments.length >= 2) eps = arguments[1];
    for (
      var i = 0;
      i < list.length;
      i++ // 选择排序对上下排序,复杂度O(N²)但一般list的长度较短只需几十次运算
    ) {
      for (var j = i + 1; j < list.length; j++) {
        if (list[i]['bounds']['bottom'] > list[j]['bounds']['bottom']) {
          var tmp = list[i];
          list[i] = list[j];
          list[j] = tmp;
        }
      }
    }
  
    for (
      var i = 0;
      i < list.length;
      i++ // 在上下排序完成后，进行左右排序
    ) {
      for (var j = i + 1; j < list.length; j++) {
        // 由于上下坐标并不绝对，采用误差eps
        if (
          Math.abs(list[i]['bounds']['bottom'] - list[j]['bounds']['bottom']) <
            eps &&
          list[i]['bounds']['left'] > list[j]['bounds']['left']
        ) {
          var tmp = list[i];
          list[i] = list[j];
          list[j] = tmp;
        }
      }
    }
    let res = '';
    for (var i = 0; i < list.length; i++) {
      res += list[i]['text'];
    }
    list = null;
    return res;
}
/**
 * @description: 华为文字识别
 * @return: 文字识别内容
 */
function huawei_ocr_api(img) {
    console.log('华为ocr文字识别中');
    var answer = "";
    var res = http.postJson(
        'https://' + endpoint + '/v2/' + projectId + '/ocr/web-image', {
            "image": images.toBase64(img)
        }, {
            headers: {
                "User-Agent": "API Explorer",
                "X-Auth-Token": token,
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
    );
    var res = res.body.json();
    try {
        var words_list = res.result.words_block_list;
    } catch (error) {
        // console.info('华为ocr文字识别请求错误，可能有两种情况\n1.华为ocr欠费\n2.配置时除账号密码外，其他的出错')
        toastLog(error);
        exit();
    }
    for (var i in words_list) {
        answer += words_list[i].words;
    }
    // console.info(answer.replace(/\s*/g, ""));
    return answer.replace(/\s*/g, "");
}
/**
 * @description: 返回主界面
 */
function back_table() {
    delay(1);
    var num = 0;
    while (!desc("工作").exists()) { //等待加载出主页
        s.info("当前没有在主页，正在返回主页");
        back();
        delay(1);
        num++;
        if(className('Button').textContains('退出').exists()){
            var c = className('Button').textContains('退出').findOne(3000);
            if(c) c.click();
            delay(1);
        }
        if(num>10){
            s.error('返回超过10次，可能当前不在xxqg，正在启动app...');
            launchApp("学习强国") || launch('cn.xuexi.android'); //启动学习强国app
            s.info('等待10s继续进行');
            delay(10);
            num = 0;
        }
    }
}
/**
 * @description: 开关广播
 * @param:开true -> 关false
 */
function start_close_radio(flag){
    back_table();
    if(flag){
        click('电台');
        delay(1);
        click('听广播');
        delay(1);
        var tmp = className('android.support.v7.widget.RecyclerView').findOne(5000);
        if(tmp){
            tmp.child(0).click();
        }
    }
    else{
        click('电台');
        delay(1);
        click('听广播');
        delay(1);
        var tmp = id('v_playing').findOne(5000);
        if(tmp){
            tmp.click();
        }
    }
}

/**
 * @description: 订阅
 */
function sub(){
    if(sub_num == 0 || hamibot.env.sub=='a') return;
    if(!files.exists('/sdcard/sub_position.txt')){
        s.error('没有订阅坐标，跳过订阅');
        return;
    }
    s.info('开始订阅,还需要订阅'+(sub_num)+"个");
    back_table();
    desc('工作').click();
    delay(2);
    click('订阅');
    delay(2);
    text('添加').depth(25).findOne().parent().click();
    delay(2);
    try{
        if(hamibot.env.sub == 'b'){     // 只查看上新
            sub_click();
        }
    }
    catch(e){
        log(e);
        s.error('坐标错误？重新生成坐标试试');
        back_table();
    }
}
/**
 * @description: 订阅平台切换
 */
function sub_click(){
    eval(files.read('/sdcard/sub_position.txt'));
    for(var i = 0;i<position.length && sub_num;i+=2){
        press(position[i],position[i+1],100);
        if(i == 0 || i == 23){delay(0.5);continue};

    }
}
/**
 * @description: 点击订阅
 */
function pic_click() {
    while (sub_num > 0) {
        let result = findColor(captureScreen(), '#E42417', {
            max: 5,
            region: [s1, 100, device.width - s1, device.height - 200], //区域
            threshold: 10,
        });
        if (result) {
            console.log("已经订阅了" + (3 - sub_num) + "个");
            press(result.x + 10, result.y + 10,100);
            sub_num--;
        } else {
            break;
        }
        delay(1);
    }
}
