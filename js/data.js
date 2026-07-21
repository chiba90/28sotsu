/**
 * PRESENTATION SLIDE DATA DB
 * Refined for High Impact: Concise text, enlarged emphasis, high readability.
 */
const PRESENTATION_DATA = {
  meta: {
    title: "株式会社デジタルプラス 取締役プレゼンテーション",
    subtitle: "不確実性を生き抜くキャリア論",
    presenter: "千葉 博文",
    totalSlides: 10
  },
  slides: [
    /* SLIDE 1: INTRO */
    {
      id: "slide-1",
      type: "hero",
      badge: "EXECUTIVE BRIEFING / CAREER LOG",
      accent: "amber",
      title: '綺麗事抜きの、<span class="text-highlight-amber">ビジネスと自己生存のリアル</span>',
      subtitle: '筑波大学新卒入社から13年。逆境・ピボット・危機を越え、東証上場企業の取締役へ。',
      presenter: {
        name: "千葉 博文",
        englishName: "Hirofumi Chiba",
        role: "取締役 (2013年新卒入社)",
        university: "筑波大学理工学群 社会工学類 卒",
        tagline: "「逆境を仕組みで突破し、非連続な成長を生み出す」",
        daughterName: "千葉フローレンス夏歌 ちゃん",
        daughterNote: "👧 愛娘に誇れる圧倒的に明るい未来をつくることが、すべての挑戦の原動力！",
        daughterImg: "PXL_20260705_051631581.jpg"
      },
      metric: {
        badge: "CONTINUOUS DISRUPT",
        value: "910日+",
        label: "英語学習・自己変革の毎日継続",
        note: "過去の成功体験をアンラーンし、常に思考の限界を更新"
      },
      theme: {
        badge: "THEME OF TODAY",
        title: '不確実性を生き抜く<br><span class="text-highlight-amber">キャリアの「第一原理」</span>',
        note: "成功・失敗・経営の本音まで100%オープンに開示"
      },
      footerNote: "※ 左右のキー [←] [→] または下部ボタンで進みます"
    },

    /* SLIDE 2: MY GOAL & ORIGIN */
    {
      id: "slide-2",
      type: "split",
      badge: "ORIGIN & PURPOSE",
      accent: "amber",
      title: '人生の最終目標と、<span class="text-highlight-amber">原点となった衝撃</span>',
      subtitle: '何のために働き、どんな未来を創るのか。すべての挑戦の根底にある意志',
      cards: [
        {
          badge: "GOAL : 最終目的地",
          badgeColor: "amber",
          title: "地方から「自ら仕事を生み出す起業家」が育つエコシステム構築",
          body: "単なる雇用支援に留まらず、挑戦を後押しし自立した起業家が生まれる**事業生態系を全国に創り出すこと**が、私の人生をかけたミッションです。"
        },
        {
          badge: "ORIGIN : 2011年 震災ボランティア",
          badgeColor: "blue",
          title: "「この街が綺麗になる頃には、もう誰も住んでいないだろうね」",
          body: "被災地のお婆さんの一言に衝撃を受け、**「真の復興とは支援ではなく、持続的にお金を稼ぎ使える仕組み＝仕事の創出である」**と確信。新卒入社へ。"
        }
      ],
      footerNote: "※一切の妥協なくやり切り、会社を再成長軌道に乗せるプロセスこそが自身の財産"
    },

    /* SLIDE 3: 3 INVESTMENT GUIDELINES */
    {
      id: "slide-3",
      type: "grid",
      badge: "COMPETENCY & CORE VALUES",
      accent: "amber",
      title: '自己をアップデートし続ける<span class="text-highlight-amber">「3つの投資指針」</span>',
      subtitle: '自身の成長を組織の限界にしないための行動基準',
      cards: [
        {
          badge: "1. Unlearn & Scale",
          badgeColor: "amber",
          title: "自分が組織のボトルネックにならない",
          body: '常に自らの既成概念を<span class="text-highlight-amber">アンラーン（学習棄却）</span>し、挑戦の限界を自ら押し広げ続けます。'
        },
        {
          badge: "2. Systems over Heroism",
          badgeColor: "blue",
          title: "個人の実績を「再現可能なシステム」へ",
          body: '属人性に頼らず、テクノロジーとシステム思考で<span class="text-highlight-blue">自律的に回る拡大仕組み</span>を構築します。'
        },
        {
          badge: "3. Gravitational Credibility",
          badgeColor: "purple",
          title: "圧倒的な「社会的信用」を勝ち取る",
          body: '将来、地方で挑戦者を支援し資金と人を動かすため、<span class="text-highlight-purple">誰もが認める信用価値</span>を高め続けます。'
        }
      ],
      footerNote: "※現在のポジションに安住せず、自分自身を投資対象としてアップデートし続ける"
    },

    /* SLIDE 4: W-STAR 2013-2018 */
    {
      id: "slide-4",
      type: "w-star",
      badge: "FIRST PHASE : 2013.4 - 2018.3",
      accent: "blue",
      title: '新卒から新規事業構築、<span class="text-highlight-blue">子会社代表取締役社長へ</span>',
      subtitle: 'アセットの限界を仕組みで突破し、大幅な新規利益を創出',
      star: {
        s: "主力ポイントメディア責任者に就任も、急激なスマホシフトに対し獲得投資資金ゼロの極限状態。",
        t: "追加資金ゼロの制約下で、競合を上回る強力な「新規収益エンジン」を立ち上げること。",
        a: "アドテク融合の「ポイントゲーム」システムを自社開発。競合メディア群へもOEM展開（B2B2C）。",
        r: '<span class="stat-callout text-highlight-blue">年間4億円の新規営業利益</span>を創出し、子会社代表取締役社長に就任。'
      },
      why: {
        title: "W : Why (当事者意識の覚悟)",
        body: "新卒時に本当にやりたかった部署への配属ではなかったが、「自分の配属先が会社全体の投資源泉である」と解釈を転換。置かれた場所で圧倒的な結果を出し、存在意義を創出。"
      },
      footerNote: "※感情のマネジメントから、システムとエコシステムによる仕組み化への転換"
    },

    /* SLIDE 5: W-STAR 2018-2023 (1) */
    {
      id: "slide-5",
      type: "w-star",
      badge: "SECOND PHASE (1) : 2018.4 - 2023.9",
      accent: "purple",
      title: '売上99%減の極限状態から、<span class="text-highlight-purple">事業再生と上場維持</span>',
      subtitle: '主力事業の撤退・構造改革を主導し、企業の最悪の危機を回避',
      star: {
        s: "主力事業の急減速により抜本ピボットを決断。年商46億円から月商500万円（99%減）まで縮小。",
        t: "倒産リスクを回避し、東証マザーズ（現グロース）における「上場維持」条件をクリアすること。",
        a: "役員報酬30%カットを即座に断行。不採算事業の売却と誠意ある対話による組織再構築を主導。",
        r: '<span class="stat-callout text-highlight-purple">不可能と言われた「上場維持」を完遂</span>。筋肉質な財務基盤を守り抜く。'
      },
      why: {
        title: "W : Why (不退転の意志)",
        body: "過去の成功も自身が作った子会社も全て失う中で、「自分が選択した場所で最後まで戦い抜く」と決意。ダメになるなら極限までやり切るという責任と誇りを貫く。"
      },
      footerNote: "※綺麗事抜きの、会社とステークホルダーを絶対に守り抜く意思決定プロセス"
    },

    /* SLIDE 6: W-STAR 2018-2023 (2) */
    {
      id: "slide-6",
      type: "w-star",
      badge: "SECOND PHASE (2) : 2018.4 - 2023.9",
      accent: "amber",
      title: '直開拓M&Aと、<span class="text-highlight-amber">Googleアルゴリズム大被弾からのV字回復</span>',
      subtitle: '泥臭い営業開拓とデータ駆動の高速改善で、投資回収率177%達成',
      star: {
        s: "新事業補強のためWebメディアM&Aを企画も仲介手数料の予算なし。直後にGoogle大被弾（利益90%減）。",
        t: "仲介なしの直開拓スキーム構築と、被弾メディアの爆速V字回復。",
        a: "自身と若手のみで月2万件アプローチ・200件商談。SEO構造を不眠不休で全面リライト。",
        r: '被弾メディアを2ヶ月で回復。<span class="stat-callout text-highlight-amber">投資4.21億円に対し 7.48億円回収（回収率177%）</span>。'
      },
      why: {
        title: "W : Why (絶対的オーナーシップ)",
        body: "「自分が利益の太い柱を作らなければ、新事業（デジタルギフト®）が育つ前に会社が倒れる」。言い訳を一切捨て、自らの行動量と分析力で切り開く。"
      },
      footerNote: "※2023年には自立を見極め戦略売却。フィンテック事業へ全経営資源を集中"
    },

    /* SLIDE 7: W-STAR 2023-PRESENT */
    {
      id: "slide-7",
      type: "w-star",
      badge: "THIRD PHASE : 2023.10 - PRESENT",
      accent: "emerald",
      title: 'デジタルギフト®の爆発的成長と<span class="text-highlight-emerald">専任人事ゼロからの組織倍増</span>',
      subtitle: '流通額（GMV）6.6倍成長と、取締役自らが牽引するタレント採用',
      star: {
        s: "フィンテック事業管掌役に就任。薄利多売モデルのため巨額広告不可。専任人事担当者も完全不在。",
        t: "流通総額（GMV）の非連続成長と、人事不在の中での優秀人材の獲得。",
        a: "ABMマーケティング主導。採用では取締役自らがトップリクルーターとして最前線に立つ。",
        r: 'GMVを45億円から<span class="stat-callout text-highlight-emerald">300億円規模（6.6倍）</span>へ拡大。27卒内定承諾5名獲得。'
      },
      why: {
        title: "W : Why (トップリクルートの思想)",
        body: "変化の激しい成長現場において、ビジョンと課題の解像度を最も高く語れるのは経営陣自身。人事に任せきりにせず、自ら汗をかくことこそが最高の仲間を惹きつける。"
      },
      footerNote: "※GMV300億を支えるための筋肉質で自律的な組織づくりの構造化"
    },

    /* SLIDE 8: TRUTH 1 */
    {
      id: "slide-8",
      type: "truth",
      badge: "FIRST-PRINCIPLES CAREER : PART 1",
      accent: "rose",
      title: 'キャリアの真実①：<span class="text-highlight-rose">「ベンチャー＝若手に裁量権」の嘘と本質</span>',
      subtitle: '単なる作業の丸投げと、本物の意思決定権の違い',
      myth: {
        label: "よくある採用ピッチの甘い言葉",
        quote: "「うちはベンチャーだから、1年目から億円単位の予算と裁量を渡して自由に挑戦させるよ！」",
        note: "採用ブランディング用の耳ざわりの良い定型文。"
      },
      fact: {
        label: "経営者・プロリクルーターの本音ファクト",
        quote: "実力も信頼関係もない人物に、決定権を渡せるわけがありません。",
        body: '多くの場合、人員不足による<span class="text-highlight-rose">「作業の丸投げ（自由度）」</span>に過ぎません。<br><br>本当の裁量権とは、**「成果」と「信頼残高」**をもぎ取ったプロにのみ与えられる報酬です。成果を出したメンバーには最高の打席を用意します。'
      },
      footerNote: "※綺麗事ばかりを吹聴する採用マーケティングではなく、リアルな成長環境を語りたい"
    },

    /* SLIDE 9: TRUTH 2 */
    {
      id: "slide-9",
      type: "truth",
      badge: "FIRST-PRINCIPLES CAREER : PART 2",
      accent: "rose",
      title: 'キャリアの真実②：<span class="text-highlight-rose">「大手＝安泰」の幻想と、これからのリアル</span>',
      subtitle: '会社に守られる安定から、どこでも通用する「自立した市場価値」へ',
      myth: {
        label: "旧来の安定モデルの崩壊",
        quote: "「有名な大手にいれば、定年まで守られて安泰な人生が約束される」",
        body: "従来の終身雇用モデルは崩壊。これからはサークルではなく、成果にコミットする**Netflix型「高密度プロスポーツチーム」**へ移行します。"
      },
      fact: {
        label: "真の「安定」の再定義",
        quote: "明日どんな荒野に放り出されても稼げる「自分の腕＝実力」こそが唯一の安定。",
        body: '組織の看板を失った時、何が残るか。<span class="text-highlight-rose">自らの足で立ち、市場価値を高め続けたい個人</span>のための最高の鍛錬場であり続けます。'
      },
      footerNote: "※自分の市場価値を会社依存から解き放つために、一番知ってほしい話"
    },

    /* SLIDE 10: CLOSING */
    {
      id: "slide-10",
      type: "closing",
      badge: "LAST SECTION : NO-LIMIT DIALOGUE",
      accent: "amber",
      title: '未来は、<span class="text-highlight-amber">絶対に自分たちの手で明るくできる。</span>',
      subtitle: '大改革と危機を乗り越えてきたからこそ語れる、本音のQ&Aセッション',
      cards: [
        {
          icon: "❓",
          title: "取締役を焦らせる「NGなし」の直球質問を歓迎",
          body: "「事業再生時の離職率は？」「退職勧奨時どう声をかけた？」「取締役の今のぶっちゃけた給与は？」など、どんなタブー質問でも直球回答します。",
          note: "建前抜きのリアルな経営現場をすべて開示"
        },
        {
          icon: "🤝",
          title: "本気の仲間を探すため、着飾らず向き合う",
          body: "人事を通さず取締役が直接対話するのは、お互いが「本気で未来を創るパートナー」になれるかを見極めるため。熱量のある対話を始めましょう。",
          note: "あなたの本気のキャリア観と疑問をぶつけてください"
        }
      ],
      footerNote: "※千葉 博文の「生存戦略」、これにて終了。本番のQ&Aセッションに入ります"
    }
  ]
};
