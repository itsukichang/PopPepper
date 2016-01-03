
var itemNameArray;
var itemImageUrlArray;
var itemUrlArray;
var itemCaptionArray;
var itemReviewValueArray;
var itemEmotionArray;
var itemEmotionWordsArray;
var itemAuthorArray;
var itemPriceArray;
var itemDateArray;


var itemCount;

var rakutenURL = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20130522';
var rakutenID = '1014089941623070202';
var rakutenHits = '5';

var emotionJudgURL = 'https://lr.capio.jp/webapis/iminos/synana_k/1_1/';
var emotionJudgID = '94Hq6C3Pgitv8EqY';

var negaposhiArray;

window.onload=init;

var self = this;

function init() {
    console.log("init");
    itemCount = 0;
    itemNameArray = new Array();
    itemImageUrlArray = new Array();
    itemUrlArray = new Array();
    itemCaptionArray = new Array();
    itemReviewValueArray = new Array();
    itemAuthorArray = new Array();
    itemPriceArray = new Array();
    itemDateArray = new Array();


    itemEmotionArray = new Array();
    itemEmotionWordsArray = new Array();
    negaposhiArray = ["評価無し","ポジティブ","ネガティブ","期待","依頼"];

}

//ここで本の検索情報を取ってくる
function ajaxSearch(keyword) {
    if (!keyword) {
        keyword = $('.submit.active').attr('value');
    }
    $.ajax({
        type: 'GET',
        url: rakutenURL,
        data: {
            applicationId: rakutenID,
            booksGenreId: '001004008',
            title: keyword,
            hits: rakutenHits,
            sort: 'reviewCount'
        }
    }).done(function (data) {
            console.log(keyword);
            _getItems(data);
    })
}

//本apiたたいたやつの解析
function _getItems(data) {
    //console.log(data);
    $('#container2').empty();
    var pageCount = data.pageCount;
    var current = data.page;
    var dataStat = data.count;
    //console.log(dataStat);

    if (dataStat > 0) {
        $.each(data.Items, function (i, items) {
            var item = items.Item;

            var affiliateUrl = item.itemUrl; //商品url
            var imageUrl = item.largeImageUrl; //画像
            var itemName = item.title; //本のタイトル
            var itemCaption = item.itemCaption;
            var author = item.author;
            var price = item.listPrice;
            var date = item.salesDate;

            var itemReviewValue = item.reviewAverage;

            if (itemName.length > 10) {
                itemName = itemName.substring(0, 10) + '...';
            }
            var itemPrice = item.itemPrice;
                
            itemNameArray[itemName] = itemName;
            itemUrlArray[itemName] = affiliateUrl;
            itemImageUrlArray[itemName] = imageUrl;
            itemCaptionArray[itemName] = itemCaption;
            itemReviewValueArray[itemName] = itemReviewValue;
            itemAuthorArray[itemName] = author;
            itemPriceArray[itemName] = itemPrice;
            itemDateArray[itemName] = date;

            _emotionJudg(itemName);
            itemCount++;
        });
    }
}


function _emotionJudg(itemName) {

    if (itemCaptionArray[itemName] != "") {
        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            url: emotionJudgURL,
            data: {
                acckey: emotionJudgID,
                sent: itemCaptionArray[itemName]
            }
        }).done(function (data) {
                _getEmotion(data,itemName);
        })
    } else {
        console.log("この商品には説明がありません");
        itemEmotionArray[itemName] = "?";
        itemEmotionWordsArray[itemName] = "NULL";
        emoCount++;
    }
}

var emoCount = 0;

function _getEmotion(data,itemName) {
   console.log(data);
    var emotion = data.results[0].spn;
      console.log(emotion);  
    itemEmotionArray[itemName] = emotion;
    itemEmotionWordsArray[itemName] = data.results[0].sensibilities;
    emoCount++;


    if (emoCount >= rakutenHits) {
        _setHtml();
    }
}

var divName = "#book";
var divCount = 0 ;
function _setHtml(){

    divCount = 0;
    for(i in itemNameArray) {


        /*
        <ons-carousel-item style="background-color: #085078;">
        <div class="item-label">BLUE</div>
        </ons-carousel-item>
        */
        /*
        var htmlTemplate = $('<ons-carousel-item style="background-color: #FFFFFF;">' + '<br><br>' +
               //'<div class="item-label">BLUE</div>' +
                '<a href="' + itemUrlArray[i] + '">' +
                '<img src="' + itemImageUrlArray[i] + '" alt="' + itemNameArray[i] + '" width="128" ' +
                'height="128"/>' +
                '</a></div>' +
                '<h2><a href="' + itemUrlArray[i] + '">' + itemNameArray[i] + '</a></h2>' +
                //'<p>' + itemNameArray[i] + '</p>' +
                //'<div class="meta">' + itemCaptionArray[i] + '</div>' +
                '<h3>この商品の評価値:' + itemReviewValueArray[i] + '</h3>' +
                '<input type="button" class="smp4" value="ペッパーに感想を聞く" onclick="toPepper(' + '\'' + itemNameArray[i] + '\'' + ');">' + 
                //'<p>この商品のねがぽじ値:' + itemEmotionArray[i] + ','+negaposhiArray[itemEmotionArray[i]] + '</p>' +
                //'<p>この商品の関連用語:' + itemEmotionWordsArray[i] + '</p>' +
                '</ons-carousel-item>');
        */

        var htmlTemplate = $(
               //'<div class="item-label">BLUE</div>' +
                '<a href="' + itemUrlArray[i] + '">' +
                '<img src="' + itemImageUrlArray[i] + '" alt="' + itemNameArray[i] + '" width="128" ' +
                'height="128"/>' +
                '</a></div>' +
                '<h3>' + itemAuthorArray[i] + '</h3>' + 
                '<h2><a href="' + itemUrlArray[i] + '">' + itemNameArray[i] + '</a></h2>' +
                //'<p>' + itemNameArray[i] + '</p>' +
                //'<div class="meta">' + itemCaptionArray[i] + '</div>' +

                '<hr>' +
                '<h4>この商品の発売日: ' + itemDateArray[i] + '</h3>' +
                '<h4>この商品の価格: ' + itemPriceArray[i] + '円</h3>' +
                '<h4>この商品の評価値: ' + itemReviewValueArray[i] + '</h3>' +
                '<button class="btn btn-primary"  onclick="toPepper(' + '\'' + itemNameArray[i] + '\'' + ');">pepperに感想を聞く</button>'
                //'<p>この商品のねがぽじ値:' + itemEmotionArray[i] + ','+negaposhiArray[itemEmotionArray[i]] + '</p>' +
                //'<p>この商品の関連用語:' + itemEmotionWordsArray[i] + '</p>' +
                );


        //テンプレートを追加
        var hoge = '#container2';
        divCount++;
        divName = divName + divCount;
        console.log("divName  = " + divName);
        $(divName).empty();
        $(divName).append(htmlTemplate);

        divName = "#book";

    }

    carousel.next();
}

function toPepper(i) {
    console.log("item No. " + i);

    if (itemEmotionArray[i] == 1 || itemEmotionArray[i] == 3) {
        //this.alAnimatedSpeech.say('\\vct=150\\');
        this.alAnimatedSpeech.say(i + "．この本はね，すごく評価が高いよ．");
        self.alMotion.moveTo(0, 0, -0.5).fail(function(err){console.log(err);});
        //this.alAnimatedSpeech.say('\\pau=300\\');
        this.alAnimatedSpeech.say("とても明るい内容で，読んでいて楽しくなる．");
        //this.alAnimatedSpeech.say('\\pau=500\\');
        self.alBehavior.runBehavior("animations/Stand/Emotions/Positive/Laugh_1");
    } else {
        this.alAnimatedSpeech.say('\\vct=50\\');
        this.alAnimatedSpeech.say(i + "．この本はね，すごく評価が高いよ．");
        //this.alAnimatedSpeech.say('\\pau=500\\');
        this.alAnimatedSpeech.say("なかなか重いテーマだけど，実に興味深い内容なんだ");
        self.alMotion.moveTo(0.3, 0, 0).fail(function(err){console.log(err);});
        //this.alAnimatedSpeech.say('\\pau=500\\');
        this.alAnimatedSpeech.say("少し泣けちゃう場面も...");
        //this.alAnimatedSpeech.say('\\pau=500\\');
        self.alBehavior.runBehavior("animations/Stand/Emotions/Negative/Sad_1");

    }
    self.alBehavior.runBehavior("animations/Stand/Emotions/Positive/Laugh_1");
    //this.alAnimatedSpeech.say('\\pau=200\\');
    self.alBehavior.runBehavior("animations/Stand/Gestures/ComeOn_1");
    //this.alAnimatedSpeech.say('\\pau=200\\');
    this.alAnimatedSpeech.say("あらすじはこうだ，");
    self.alMotion.moveTo(0, 0, -0.5).fail(function(err){console.log(err);});
    //this.alAnimatedSpeech.say('\\pau=500\\');
    this.alAnimatedSpeech.say(itemCaptionArray[i]);
    //this.alAnimatedSpeech.say('\\pau=1000\\');
    this.alAnimatedSpeech.say("つまり，この本のキーワードをまとめると，");
    this.alAnimatedSpeech.say(itemEmotionWordsArray[i][0] + "," + itemEmotionWordsArray[i][1] + "，"+"あとは...そうだな，" + itemEmotionWordsArray[i][2] + "といったところかな");
    //this.alAnimatedSpeech.say('\\pau=1000\\');
    this.alAnimatedSpeech.say("本当に面白いから，ぜひ読んでみて");
    
    //ここでpepperのapiをたたく
    //適当に間を取ったり，関連用語を入れたりする．
    
    //函館駅殺人事件

    //冤罪の罠に落ちたカメラマンの金井は、自分を陥れた後輩を刺殺して、故郷の函館に向かった。
    //金井を慕う美人モデルのマリ子、そして、コルトを使う謎の男・瀬沼-。金井を追って、函館駅に張り込む十津川と亀井の眼前で、射殺事件が発生し、そ
    //の背後には覚醒剤密売事件の影があった。復讐は正義か。愛にすがる逃亡犯の宿命をサスペンスフルに描いた傑作長編推理。
    //この文章の場合 ポジティブで，偽装，愛好，尊敬などのワードがある．
    

    //pepperが言う言葉

    //[title]．この本はね，すごく評価が高いよ．[動く]．[手を上げたりする]
    //あらすじはこうだ．[間を取る]
    //冤罪の罠に落ちたカメラマンの金井は、自分を陥れた後輩を刺殺して、故郷の函館に向かった。[間を取る]
    //金井を慕う美人モデルのマリ子、そして、コルトを使う謎の男・瀬沼-。[間を取る]
    //金井を追って、函館駅に張り込む十津川と亀井の眼前で、射殺事件が発生し、その背後には覚醒剤密売事件の影があった。復讐は正義か。[間を取る]

    //愛にすがる逃亡犯の宿命をサスペンスフルに描いた傑作長編推理。[間を取る]
    //[ポジティブな場合]読む前からドキドキわくわくしちゃうよね
    //[ネガティブな場合]なかなか重いテーマだけど，実に興味深いないようだと思わないかい？

    //この本についてまとめると，[関連ワード1]，[関連ワード2]，[関連ワード3]と言っても過言じゃないよね
    //函館駅殺人事件 [間を取る]
    //ポジティブな場合 [笑いのモーション] 
    //ネガティブな場合 [泣きモーション]
    //是非読んでみてよ[喜び]


    //今後の展望
    //ユーザーレビューをスクレイビングとかして取得して，お話に用いる
    //画面uiの改善
    //pepperの画面に本の画像や星を表示

    //あたまをなでると商品ページに飛ぶ


}

function search() {
     //var str1=document.txtb.value;
     var str1 = $("#bookName").val();
     console.log(str1);
     ajaxSearch(str1);
}

$(function () {
    $('.submit').click(function () {
        var keyword = $(this).attr('value');
        if (!keyword) {
            return;
        }
        ajaxSearch(keyword);
    })
});


//pepperとの接続用
function connect(){
    // 入力されたpepperのIPアドレスを取得
    var pepperIp = $("#pepperIP").val();

    // 接続が成功したら、各種プロキシを作成して代入しておく
    var setupIns_ = function(){
        self.qims.service("ALTextToSpeech").done(function(ins){
            self.alTextToSpeech = ins;
        });
        self.qims.service("ALAnimatedSpeech").done(function(ins){
            self.alAnimatedSpeech = ins;
        });
        self.qims.service("ALMotion").done(function(ins){
            self.alMotion = ins;
        });
        self.qims.service("ALBehaviorManager").done(function(ins){
            self.alBehavior = ins;
        });
        self.qims.service("ALAutonomousLife").done(function(ins){
            self.alAutonomousLife = ins;
        });
        self.qims.service("ALAudioDevice").done(function(ins){
            self.alAudioDevice = ins;
            self.alAudioDevice.getOutputVolume().done(function(val){
            self.showAudioVolume(val);
            });
        });
        self.qims.service("ALTabletService").done(function(ins){
            self.alTabletService = ins;
            console.log("alTabletService" + self.alTabletService);
        });
        self.qims.service("ALMemory").done(function(ins){
            self.alMemory = ins;

            // メモリ監視
            qimessagingMemorySubscribe();
        });
    }

    // pepperへの接続を開始する
    self.qims = new QiSession(pepperIp);
    self.qims.socket()
        // 接続成功したら
        .on('connect', function ()
            {
            self.qims.service("ALTextToSpeech")
                .done(function (tts)
                {
                    tts.say("接続、成功しました");
               });
                    // 接続成功したら各種セットアップを行う
                    setupIns_();

                    // 接続成功表示切り替え
                    $(".connectedState > .connected > .connectedText").text("接続成功");
                    $(".connectedState > .connected > .glyphicon").removeClass("glyphicon-remove");
                    $(".connectedState > .connected > .glyphicon").addClass("glyphicon-signal");
                    $(".connectedState > .connected").css("color","Blue");


               })
        // 接続失敗したら
        .on('disconnect', function () {
              //self.nowState("切断");
});
}