/**
 * PRESENTATION SLIDE DATA DB
 * Executive Longform Storytelling Edition: 10-Chapter Inspirational Autobiography.
 */
const PRESENTATION_DATA = {
  meta: {
    title: "株式会社デジタルプラス 取締役プレゼンテーション",
    subtitle: "不確実性を生き抜くキャリア論",
    presenter: "千葉 博文",
    totalSlides: 10
  },
  slides: [
    /* CHAPTER 01: INTRO */
    {
      id: "slide-1",
      type: "hero",
      badge: "CHAPTER 01 / 序章：綺麗事抜きの生存リアル",
      accent: "blue",
      title: '天国と地獄のすべてを現場でくぐり抜けた13年の記録',
      subtitle: '筑波大学新卒入社から一度も転職せず取締役へ。なぜ私はこの場所で泥臭く戦い続けるのか。',
      presenter: {
        name: "千葉 博文",
        englishName: "Hirofumi Chiba",
        role: "取締役 (2013年新卒入社)",
        university: "筑波大学理工学群 社会工学類 卒",
        tagline: "「どんな逆境も仕組みで突破し、娘に誇れる圧倒的に明るい未来を創る」",
        daughterName: "千葉フローレンス夏歌 ちゃん",
        daughterNote: "👧 愛娘に誇れる明るい未来をつくることが、すべての挑戦の原動力！",
        daughterImg: "PXL_20260705_051631581.jpg"
      },
      metric: {
        badge: "CONTINUOUS DISRUPT",
        value: "910日+",
        label: "毎日継続の英語学習 & 自己変革",
        note: "凡事徹底と、過去の成功体験を壊し続けるアンラーン"
      },
      theme: {
        badge: "THEME OF TODAY",
        title: "不確実性を生き抜くキャリアの「第一原理」",
        note: "成功談・大ピンチ・経営の本音まで100%オープンに開示"
      },
      impact: {
        badge: "CAREER TRACK RECORD",
        title: "13年・1社完遂の不屈スピリット",
        note: "東証上場維持・M&A・GMV300億拡大を現場で完遂"
      },
      footerNote: "※ 左右のキー [←] [→] または下部ボタンでストーリーが進みます"
    },

    /* CHAPTER 02: ORIGIN */
    {
      id: "slide-2",
      type: "split",
      badge: "CHAPTER 02 / 原点：2011年 震災の記憶",
      accent: "blue",
      title: '言葉を失ったお婆さんの一言と、一生をかけた誓い',
      subtitle: '被災地の瓦礫の中で悟った「真の復興」の定義と、ビジネスが果たすべき真の存在意義',
      cards: [
        {
          badge: "GOAL : 志と最終目的地",
          badgeColor: "amber",
          title: "地方から「自ら仕事を生み出す起業家」が育つエコシステム構築",
          lead: "雇用創出と挑戦者の後押し。",
          body: "単なる資金支援に留まらず、若者から自立した起業家が生まれる<span class=\"text-highlight-amber\">持続可能な事業生態系</span>を全国に創り出すことが、私の人生をかけたミッションです。",
          footer: "💡 MISSION : 挑戦者が自立し稼げる仕組みを全国へ"
        },
        {
          badge: "ORIGIN : 2011年 震災ボランティアの衝撃",
          badgeColor: "blue",
          title: "「この街が綺麗になる頃には、もう誰も住んでいないだろうね」",
          lead: "被災地のお婆さんの一言に言葉を失った。",
          body: "<strong>「真の復興とは支援ではなく、この場所で持続的にお金を稼ぎ使える仕組み＝仕事の創出である」</strong>と強く確信し、リアルワールドへ新卒入社しました。",
          footer: "🔥 TURNING POINT : 「仕事の創出」こそが最大の社会貢献"
        }
      ],
      footerNote: "※一切の妥協なくやり切り、会社を再成長軌道に乗せるプロセスこそが自身の財産"
    },

    /* CHAPTER 03: PHILOSOPHY */
    {
      id: "slide-3",
      type: "grid",
      badge: "CHAPTER 03 / 哲学：自己アップデートの法則",
      accent: "blue",
      title: '自分が組織の限界にならない「3つの投資指針」',
      subtitle: '自身の成長を止ませず、常に思考の枠組みを脱皮させ続けるプロフェッショナルとしての行動原則',
      cards: [
        {
          badge: "1. Unlearn & Scale",
          badgeColor: "amber",
          title: "自分が組織の成長のボトルネックにならない",
          lead: "思考の枠組みを脱ぎ捨てる。",
          body: "常に自らの既成概念を<span class=\"text-highlight-amber\">アンラーン（学習棄却）</span>し、挑戦の限界を押し広げ続けます。",
          footer: "💡 UNLEARN : 過去の成功体験を壊し進化"
        },
        {
          badge: "2. Systems over Heroism",
          badgeColor: "blue",
          title: "個人の実績を「再現可能なシステム」へ昇華",
          lead: "属人性に頼らない組織へ。",
          body: "テクノロジーとシステム思考で<span class=\"text-highlight-blue\">自律的に回る仕組み</span>を構築します。",
          footer: "⚡ SYSTEM : 個人技に頼らず仕組みで勝つ"
        },
        {
          badge: "3. Gravitational Credibility",
          badgeColor: "purple",
          title: "圧倒的な「社会的信用」を勝ち取る",
          lead: "誰もが認める信用価値。",
          body: "将来、地方で挑戦者を支援し資金と人を動かすための<span class=\"text-highlight-purple\">揺るぎない信用</span>を高めます。",
          footer: "💎 TRUST : 人と資金を動かす真の信用力"
        }
      ],
      footerNote: "※現在のポジションに安住せず、自分自身を投資対象としてアップデートし続ける"
    },

    /* CHAPTER 04: BREAKTHROUGH */
    {
      id: "slide-4",
      type: "w-star",
      badge: "CHAPTER 04 / 突破：年間4億円の新規利益創出",
      accent: "blue",
      title: '新卒から新規事業構築、子会社代表取締役社長へ',
      subtitle: '追加投資ゼロの制約を仕組みで突破し、年間4億円の新規営業利益を創出した軌跡',
      star: {
        s: "主力ポイントサイト責任者に就任も、スマホシフトに対し獲得投資資金ゼロの極限状態。",
        t: "追加資金ゼロの制約下で、競合を超える「新規収益エンジン」を立ち上げること。",
        a: "ポイントゲームを自社開発し、競合メディア群へもOEM展開（B2B2C）するプラットフォーム戦略を実行。",
        r: '<span class="stat-callout text-highlight-blue">年間4億円の新規営業利益</span>を創出し、子会社社長に就任。'
      },
      why: {
        title: "W : Why (当事者意識の覚悟)",
        lead: "「自身の事業が全体の投資源泉である」と解釈を転換。",
        body: "置かれた場所で言い訳を捨て圧倒的な結果を出し、自ら存在意義を創出しました。",
        footer: "🔥 PRINCIPLE : 置かれた場所で圧倒的結果を出す"
      },
      footerNote: "※感情のマネジメントから、システムとエコシステムによる仕組み化への転換"
    },

    /* CHAPTER 05: DARKEST HOUR */
    {
      id: "slide-5",
      type: "w-star",
      badge: "CHAPTER 05 / 苦闘：売上99%減と上場維持",
      accent: "purple",
      title: '売上99%減の極限状態から、痛みを伴う事業再生と上場維持',
      subtitle: '主力事業の撤退・構造改革を自ら主導し、会社の最悪の危機から命脈を守り抜く',
      star: {
        s: "主力事業の急減速により抜本ピボットを決断。年商46億円から<span class=\"text-highlight-rose\">月商500万円（99%減）</span>へ。",
        t: "倒産回避と、東証マザーズにおける「上場維持」条件のクリア。",
        a: "役員報酬30%カット断行。不採算事業売却と誠意ある対話による事業再生を主導。",
        r: '<span class="stat-callout text-highlight-purple">不可能と言われた「上場維持」を完遂</span>し、財務基盤を守る。'
      },
      why: {
        title: "W : Why (不退転の意志)",
        lead: "「自分が選択した場所で最後まで戦い抜く」と決意。",
        body: "ダメになるなら極限までやり切るという責任と誇りを貫きました。",
        footer: "🔥 RESILIENCE : 地獄の危機でも逃げずに守り抜く"
      },
      footerNote: "※綺麗事抜きの、会社とステークホルダーを絶対に守り抜く意思決定プロセス"
    },

    /* CHAPTER 06: RESURRECTION */
    {
      id: "slide-6",
      type: "w-star",
      badge: "CHAPTER 06 / 不屈：Google大被弾からのV字回復",
      accent: "amber",
      title: '直開拓M&Aと、Googleアルゴリズム大被弾からのV字回復',
      subtitle: '泥臭い行動量とデータ分析力で、投資回収率177%を叩き出した逆転劇',
      star: {
        s: "新事業補強のWebメディアM&A直後に、Googleアルゴリズム大被弾（利益90%減）。",
        t: "仲介なし直開拓M&Aの構築と、被弾メディアの爆速V字回復。",
        a: "月2万件アプローチ・自ら200件商談。SEO構造を不眠不休でリライト。",
        r: '<span class="stat-callout text-highlight-amber">投資4.21億円に対し 7.48億円回収（回収率177%）</span>。'
      },
      why: {
        title: "W : Why (絶対的オーナーシップ)",
        lead: "「自分が利益の太い柱を作らなければ会社が倒れる」。",
        body: "言い訳を一切捨て、自らの行動量と分析力で切り開きました。",
        footer: "🚀 RECOVERY : 泥臭い行動量と分析でV字回復"
      },
      footerNote: "※2023年には自立を見極め戦略売却。フィンテック事業へ全経営資源を集中"
    },

    /* CHAPTER 07: EXPANSION */
    {
      id: "slide-7",
      type: "w-star",
      badge: "CHAPTER 07 / 飛躍：デジタルギフト®300億規模へ",
      accent: "emerald",
      title: 'デジタルギフト®の爆発的成長と組織倍増',
      subtitle: '流通額（GMV）6.6倍成長と、取締役自らが最前線に立つトップリクルート',
      star: {
        s: "フィンテック事業管掌役に就任。社内に専任人事担当者が完全不在。",
        t: "流通総額（GMV）の劇的成長と、人事不在の中での優秀人材獲得。",
        a: "ABMマーケティング主導。取締役自らがトップリクルーターとして最前線へ。",
        r: 'GMVを45億円から<span class="stat-callout text-highlight-emerald">300億円規模（6.6倍）</span>へ拡大。'
      },
      why: {
        title: "W : Why (トップリクルートの思想)",
        lead: "「ビジョンを解像度高く語れるのは経営陣自身」。",
        body: "自ら汗をかくことこそが最高の仲間を惹きつけると確信。",
        footer: "✨ LEADERSHIP : 自ら汗をかき仲間を惹きつける"
      },
      footerNote: "※GMV300億を支えるための筋肉質で自律的な組織づくりの構造化"
    },

    /* CHAPTER 08: TRUTH 1 */
    {
      id: "slide-8",
      type: "truth",
      badge: "CHAPTER 08 / 洞察：ベンチャー裁量権の真実",
      accent: "rose",
      title: 'キャリアの真実①：「ベンチャー＝若手に裁量権」の嘘と本質',
      subtitle: '単なる作業の丸投げと、本物の意思決定権の違い',
      myth: {
        label: "よくある採用ピッチの甘い言葉",
        quote: "「うちはベンチャーだから、1年目から億円単位の予算と裁量を渡して自由に挑戦させるよ！」",
        note: "採用ブランディング用の耳ざわりの良い定型文。",
        footer: "⚠️ CAUTION : 自由という名の「作業丸投げ」に注意"
      },
      fact: {
        label: "経営者・プロリクルーターの本音ファクト",
        quote: "実力も信頼関係もない人物に、決定権を渡せるわけがありません。",
        lead: "多くの場合、人員不足による「作業の丸投げ」に過ぎません。",
        body: "本当の裁量権とは、<strong>「成果」と「信頼残高」</strong>をもぎ取ったプロにのみ与えられる報酬です。成果を出したメンバーには最高の打席を用意します。",
        footer: "🔥 KEY REALITY : 「成果と信用」をもぎ取ったプロに裁量を与える"
      },
      footerNote: "※綺麗事ばかりを吹聴する採用マーケティングではなく、リアルな成長環境を語りたい"
    },

    /* CHAPTER 09: TRUTH 2 */
    {
      id: "slide-9",
      type: "truth",
      badge: "CHAPTER 09 / 覚悟：大手安泰神話の終焉",
      accent: "rose",
      title: 'キャリアの真実②：「大手＝安泰」の幻想と、これからのリアル',
      subtitle: '会社に守られる安定から、どこでも通用する「自立した市場価値」へ',
      myth: {
        label: "旧来の安定モデルの崩壊",
        quote: "「有名な大手にいれば、定年まで守られて安泰な人生が約束される」",
        body: "従来の終身雇用モデルは崩壊。サークルではなく、成果にコミットする<strong>Netflix型「高密度プロスポーツチーム」</strong>へ移行します。",
        footer: "⚠️ CAUTION : 「大手＝終身雇用」の神話は完結"
      },
      fact: {
        label: "真の「安定」の再定義",
        quote: "明日どんな荒野に放り出されても稼げる「自分の腕＝実力」こそが唯一の安定。",
        lead: "従来の終身雇用モデルは崩壊しました。",
        body: "組織の看板を失った時、何が残るか。<span class=\"text-highlight-rose\">自らの足で立ち、市場価値を高め続けたい個人</span>のための最高の鍛錬場であり続けます。",
        footer: "🔥 KEY REALITY : 荒野でも稼げる「個人の市場価値」を研ぎ澄ます"
      },
      footerNote: "※自分の市場価値を会社依存から解き放つために、一番知ってほしい話"
    },

    /* CHAPTER 10: CLOSING */
    {
      id: "slide-10",
      type: "closing",
      badge: "CHAPTER 10 / 結び：未来は自分たちの手で創る",
      accent: "blue",
      title: '「未来は、絶対に自分たちの手で明るくできる。」',
      subtitle: '大改革と危機を乗り越えてきたからこそ語れる、本音のQ&Aセッション',
      cards: [
        {
          icon: "❓",
          title: "取締役を焦らせる「NGなし」の直球質問を歓迎",
          lead: "NG制限なしの直球回答。",
          body: "「事業再生時の離職率は？」「退職勧奨時どう声をかけた？」「取締役の今のぶっちゃけた給与は？」など、リアルな経営現場を開示します。",
          note: "💡 クリックで質問例をモーダル表示＆ダイレクト対話が可能です",
          footer: "❓ DIRECT Q&A : 経営の裏側もすべてオープンに開示"
        },
        {
          icon: "🤝",
          title: "本気の仲間を探すため、着飾らず向き合う",
          lead: "本気の対話。",
          body: "人事を通さず取締役が直接対話するのは、お互いが「本気で未来を創るパートナー」になれるかを見極めるため。熱量のある対話を始めましょう。",
          note: "🔥 あなたの本気のキャリア観と疑問をぶつけてください",
          footer: "🤝 PARTNERSHIP : 未来を創る本気の仲間を探す対話"
        }
      ],
      footerNote: "※千葉 博文の「生存戦略」、これにて終了。本番のQ&Aセッションに入ります"
    }
  ]
};
