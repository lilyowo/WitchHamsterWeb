import { Component, ChangeDetectionStrategy, PLATFORM_ID, Inject, ChangeDetectorRef} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-liu-ren',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './liu-ren.html',
  styleUrls: ['./liu-ren.css'],
  changeDetection: ChangeDetectionStrategy.Default // Corrected line
})
export class LiuRen {
  showModal: boolean = true;
  private readonly API_KEY = environment.geminiApiKey;
  genAI: GoogleGenerativeAI = new GoogleGenerativeAI(this.API_KEY);
  question: string = '';
  num1: number | null = null;
  num2: number | null = null;
  num3: number | null = null;

  resultA: string = '...';
  resultB: string = '...';
  resultC: string = '...';
  analysisText: string = '等待計算中...';
  
  analysisText2: string = '點擊下方按鈕獲取靈感...';
  isLoading: boolean = false;

  private readonly results = [
    '天德', '大安', '留連', '速喜', '赤口',
    '小吉', '空亡', '病符', '桃花'
  ];

  private readonly resultMeaning: Record<number, string> = {
    0: '受到天助，有貴人出現，事情容易得到幫助。在八卦中屬乾卦，五行屬金，方位西北。',
    1: '局勢穩定，適合按部就班進行，若求安穩則大吉，若球變化則不吉。在八卦中屬震卦，五行屬木，方位正東。',
    2: '事情容易拖延，需要多一點耐心，若想挽留延遲則大吉，否則皆不吉。在八卦中屬巽卦，五行屬木，方位西南。',
    3: '消息來得快，進展迅速，令人意想不到的好事或壞事。在八卦中屬離卦，五行屬火，方位正南。',
    4: '容易有口舌是非或衝突，導致吵架打架需要謹慎應對，連出兩個赤口要當心血光之災。在八卦中屬兌卦，五行屬金，方位正西。',
    5: '問事情成敗屬勉強吉格，成中有缺，若初始起步為吉。在八卦中屬坎卦，五行屬水，方位正北。',
    6: '事情可能落空，先得後失，忌金錢之事，宜虛幻之事如玄學、哲學、心理學等。在九宮中立中宮，五行屬土，方位正中。',
    7: '身心疲憊或狀態不佳，或指事情有病根有問題需醫治需處理。在八卦中屬坤卦，五行屬土，方位西南。',
    8: '與人際、感情、吸引力有關，若問人際關係桃花運勢則大吉，否則事件將有人事牽絆糾纏難處理不吉。在八卦中屬艮卦，五行屬土，方位東北。'
  };

  
  private model: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object , private cdr: ChangeDetectorRef) {
    if (isPlatformBrowser(this.platformId)) {
      this.initGemini();
    }
  }

  private async initGemini() {
    try {
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash" 
      });
      console.log('✅ Gemini 初始化成功');
    } catch (error) {
      console.error('❌ Gemini 初始化失敗:', error);
    }
  }

  calculate() {
    if (this.num1 === null || this.num2 === null || this.num3 === null) {
      alert('請輸入三個數字喔!');
      return;
    }
    const x = this.num1 % 9;
    const y = (this.num2 + x - 1) % 9;
    const z = (this.num3 + y - 1) % 9;

    this.resultA = this.results[x];
    this.resultB = this.results[y];
    this.resultC = this.results[z];

    const startText = this.resultMeaning[x];
    const processText = this.resultMeaning[y];
    const endText = this.resultMeaning[z];

    this.analysisText =
      `這件事情剛開始會${startText}\n` +
      `過程的情況會${processText}\n` +
      `最後結果會${endText}`;

    console.log('準備關閉彈窗');
    this.showModal = false;
    
    this.analysisText2 = '點擊「查看」按鈕,讓 AI 為您深入解惑...';
  }

  async getAIInterpretation() {
    if (this.resultA === '...') {
      alert('請先輸入數字進行初步計算!');
      return;
    }

    if (!this.model) {
      alert('AI 功能正在載入中,請稍候再試');
      return;
    }

    this.isLoading = true;
    this.analysisText2 = '倉鼠正在用短短的爪子認真掐指一算,請稍候...';
    
    const prompt = `請你扮演一位女倉鼠法師,針對問題「${this.question}」給予回答。
占卜結果是:【${this.resultA}】、【${this.resultB}】、【${this.resultC}】。
基本的判斷是:${this.analysisText}。
請給我 300 字以內的解析，只講重點，口吻要嚴肅禮貌並且犀利。以「倉鼠法師掐指一算，認為你問的這件事」為開頭`;

    try {
      console.log('🔮 開始呼叫 Gemini API...');
      console.log('📝 Prompt:', prompt);
      
      // 呼叫 API 並獲取回應
      const result: GenerateContentResult = await this.model.generateContent(prompt);
      const response = await result.response;
      this.cdr.detectChanges();
      // const text: string = await response.text();
      this.analysisText2 = await response.text();
      console.log('✅ AI 解析成功:', this.analysisText2);

      this.isLoading = false; 
      this.cdr.detectChanges();
      
    } catch (error: any) {
      console.error("❌ AI 呼叫完整錯誤", error);
      
      if (error.message?.includes('API_KEY_INVALID')) {
        this.analysisText2 = "API Key 無效,請檢查設定。";
      } else if (error.message?.includes('not found')) {
        this.analysisText2 = "模型不存在,請確認 API Key 權限。";
      } else if (error.message?.includes('quota')) {
        this.analysisText2 = "API 配額已用完,請稍後再試。";
      } else {
        this.analysisText2 = `系統錯誤: ${error.message || '未知錯誤'}`;
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}