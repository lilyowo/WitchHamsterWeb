import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 必須匯入以支援 ngModel

@Component({
  selector: 'app-liu-ren',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './liu-ren.html',
  styleUrls: ['./liu-ren.css']
})
export class LiuRen {
  // 控制彈窗顯示
  showModal: boolean = true;

  // 使用者輸入內容
  question: string = '';
  num1: number | null = null;
  num2: number | null = null;
  num3: number | null = null;

  // 計算出的結果
  resultA: string = '...';
  resultB: string = '...';
  resultC: string = '...';
  analysisText: string = '等待計算中...';
  private readonly results = [
    '天德', '大安', '留連', '速喜', '赤口',
    '小吉', '空亡', '病符', '桃花'
  ];
  private readonly resultMeaning: Record<number, string> = {
    0: '受到天助，有貴人出現，事情容易得到幫助',
    1: '局勢穩定，適合按部就班進行',
    2: '事情容易拖延，需要多一點耐心',
    3: '好消息來得快，進展迅速',
    4: '容易有口舌或衝突，需要謹慎應對',
    5: '雖小但吉，有實際收穫',
    6: '事情可能落空，需重新評估',
    7: '身心疲憊或狀態不佳，宜保守',
    8: '與人際、感情、吸引力有關'
  };


  calculate() {
    if (this.num1 === null || this.num2 === null || this.num3 === null) {
      alert('請輸入三個數字喔！');
      return;
    }
    const x = this.num1%9;
    const y = (this.num2 + x - 1)%9;
    const z = (this.num3 + y - 1)%9;

    this.resultA = this.results[x];
    this.resultB = this.results[y];
    this.resultC = this.results[z];

    // this.analysisText = "這是一個示範解析。根據你輸入的數字 " + 
    //                     this.num1 + ", " + this.num2 + ", " + this.num3 + 
    //                     "，倉鼠發現這件事情大有可為！";
    const startText = this.resultMeaning[x];
    const processText = this.resultMeaning[y];
    const endText = this.resultMeaning[z];

    this.analysisText =
      `這件事情剛開始會${startText}，` +
      `過程會${processText}，` +
      `最後會${endText}。`;

    // 2. 關閉彈窗
    console.log('準備關閉彈窗');
    this.showModal = false;
  }
}