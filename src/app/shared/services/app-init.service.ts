import { Injectable } from '@angular/core';
import { CategoryClass } from '../models/category-class.model';
import { WordClass } from '../models/word-class.model';
import { AuthService } from './auth.service';
import { CategoryInfraService } from './category-infra.service';
import { WordInfraService } from './word-infra.service';

const DEFAULT_NUMBER = 372;

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  public userEmail;
  //public loading:any;
  public load_counter = 0;
  phraseCounter = 0;
  private time: number


  constructor(
  public categoryInfra: CategoryInfraService,public wordInfra: WordInfraService,
    // public loadingCtrl: LoadingController,
    public authentication: AuthService,
  ) {
    this.time = 5000;
    this.userEmail = authentication.userData.email;
  }

  //===================================
  /**This method adds the category& his phrases to the DB.
   * @param category the category to be added to the DB.
   * @param words the array of the phrases of this category.
   * @param subCat the array of the sub categories of this category.
   * @param subPhrases the array of the arrays of the phrases each per sub category.
   * @param subFlag true if the category is a sub category and there is need to use "findSubCategoryByID".
   * @returns the ID of the added category in the DB.
   */
  //  add_new_cat_to_db(category: CategoryClass, words: WordClass[], subCat: CategoryClass[], subPhrases: WordClass[][], subFlag: boolean) {
  //   let catId: string;
  //   let promise;
  //   this.categoryInfra.addCategory(category, true)?.then(() => {
  //     if (subFlag)
  //       promise = this.categoryInfra.getSubCategoryByName(category.parentCategoryID, category.name);
  //     else
  //       promise = this.categoryInfra.getCategoryByName(category.name);
  //     promise.then((data) => {
  //       catId = data.id;
  //       for (let i = 0; i < words.length; i++) {
  //         words[i].order = i;
  //         words[i].categoryID = catId;

  //         let pro = this.wordInfra.addPhrase(words[i], true);
  //         pro.then((data) => {
  //           this.phraseCounter++;
  //           //close the loading window after all the phrases was added
  //           if (this.phraseCounter == DEFAULT_NUMBER) {
  //             this.phraseCounter = 0;
  //             setTimeout(() => {
  //               //this.loading.dismiss();
  //             }, 3000);
  //           }
  //         })
  //       }
  //       for (let i = 0; i < subCat.length; i++) {
  //         subCat[i].order = i;
  //         subCat[i].parentCategoryID = catId;
  //         this.add_new_cat_to_db(subCat[i], subPhrases[i], [], [], true)
  //       }
  //     })
  //   })
  // }
  add_new_cat_to_db(category: CategoryClass, phrases: WordClass[], subCat: CategoryClass[], subPhrases: WordClass[][], subFlag: boolean) {
    let catId: string;
    this.categoryInfra.addCategory(category);
    let promise;
    setTimeout(() => {
      if (subFlag) {
        promise = this.categoryInfra.getSubCategoryByName(category.parentCategoryID, category.name)
      }
      else
        promise = this.categoryInfra.getCategoryByName(category.name);
      promise.then((data) => {
        let cat = data;
        cat as CategoryClass;
        catId = cat.id;
        for (let i = 0; i < phrases.length; i++) {
          phrases[i].order = i;
          phrases[i].categoryID = catId;
          this.wordInfra.addPhrase(phrases[i]);
        }
        for (let i = 0; i < subCat.length; i++) {
          subCat[i].order = i;
          subCat[i].parentCategoryID = catId;
          this.add_new_cat_to_db(subCat[i], subPhrases[i], [], [], true)
        }
      })
    }, this.time);

  }


  //===================================

  /**this method fill the DB for the user with the default categories&phrases
  */
  fillDB() {
    // this.loading = this.loadingCtrl.create({
    //   content: 'רק רגע, אנחנו מייצרים עבורך את המאגר'
    // });
    //this.loading.present();
    let cat;
    let words:WordClass[];
    let subCats;
    let subPhrases;

    //AboutMe, this category has its own tab
    // cat = new CategoryClass("about me", "", "", this.userEmail, "", 0, false, 0, true)
    // words = [
    //   new WordClass("", "קוראים לי", "", "", 0, "", false, 0, true),
    //   new WordClass("", "טלפון", "", "", 0, "", false, 0, true),
    //   new WordClass("", "תאריך לידה", "", "", 0, "", false, 0, true),
    //   new WordClass("", "מצב משפחתי", "", "", 0, "", false, 0, true),
    //   new WordClass("", "מצב רפואי", "", "", 0, "", false, 0, true),
    //   new WordClass("", "שפות שאני מדבר", "", "", 0, "", false, 0, true),
    //   new WordClass("", "מקום הולדתי", "", "", 0, "", false, 0, true),
    //   new WordClass("", "מקצוע", "", "", 0, "", false, 0, true),
    //   new WordClass("", "השכלה", "", "", 0, "", false, 0, true),
    //   new WordClass("", "תחביבים", "", "", 0, "", false, 0, true),
    //   new WordClass("", "שירות צבאי", "", "", 0, "", false, 0, true),
    //   new WordClass("", "שנת עליה לישראל", "", "", 0, "", false, 0, true),
    // ];

    // subCats = [
    //   new CategoryClass("אנשים שאני מכיר", "", "", this.userEmail, "", 0, false, 0, true),
    // ]

    // subPhrases = [
    //   [
    //     new WordClass("", "משפחה", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אישתי", "", "", 0, "", false, 0, true),
    //     new WordClass("", "ילדים", "", "", 0, "", false, 0, true),
    //     new WordClass("", "ההורים שלי", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אחים ואחיות", "", "", 0, "", false, 0, true),
    //     new WordClass("", "קרובי משפחה נוספים", "", "", 0, "", false, 0, true),
    //     new WordClass("", "חברים", "", "", 0, "", false, 0, true),
    //   ],

    // ];

    // this.add_new_cat_to_db(cat, words, subCats, subPhrases, false);

    //FEELINGS CATEGORY
    cat = new CategoryClass("רגשות", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2F%25E2%2580%258F%25E2%2580%258Ffeelings.PNG?alt=media&token=55054802-6fd2-47e3-b839-dae16752a169", this.userEmail, "", 0, false, 3, true)

    words = [
      new WordClass("", "שמחה", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2Fhappy.PNG?alt=media&token=e0d5a579-457b-4409-a046-60a407fb282c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%A9%D7%9E%D7%97%D7%94.mp3?alt=media&token=58b3355b-7750-4af3-b194-909b7ea73c9f", false, 0, true),
      new WordClass("", "אהבה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Love.jpg?alt=media&token=7ec44f31-27b4-4050-9abd-d2bc788011f3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%90%D7%94%D7%91%D7%94.mp3?alt=media&token=27873761-9fd9-4947-ab6c-2d77d24ae210", false, 0, true),
      new WordClass("", "רוגע", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/calm.jpg?alt=media&token=e4cbb7bc-5af1-4f4d-b636-aaf312275421", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%A8%D7%95%D7%92%D7%A2.mp3?alt=media&token=5de241cc-71cd-4c55-8748-9557965fcf85", false, 0, true),
      new WordClass("", "הפתעה", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2Fsuprised.PNG?alt=media&token=bdcc65e1-b818-4310-8db7-8b9770973ed0", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%94%D7%A4%D7%AA%D7%A2%D7%94.mp3?alt=media&token=035eef05-5e51-4828-ba1a-e4ac70a47897", false, 0, true),
      new WordClass("", "אדישות", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2Fapathetic.PNG?alt=media&token=fb7c33bd-9665-4fa1-b699-611473bd8bd5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%90%D7%93%D7%99%D7%A9%D7%95%D7%AA.mp3?alt=media&token=149bea28-35b3-455b-8e99-a936ebe5e6b7", false, 0, true),
      new WordClass("", "עצב", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2Fsad.PNG?alt=media&token=0822bc18-8a74-43f2-8fdb-83d845ca2696", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%A2%D7%A6%D7%91.mp3?alt=media&token=f03b83d5-23e5-42d7-b06b-40c7b91449c8", false, 0, true),
      new WordClass("", "כעס", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/canstockphoto23194080.jpg?alt=media&token=0619d8dd-e877-4eaf-b7ed-1ae967dc77a4", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%9B%D7%A2%D7%A1.mp3?alt=media&token=970f9668-775d-40e0-9169-645ffe6ddd7e", false, 0, true),
      new WordClass("", "בלבול", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/confused.png.crdownload?alt=media&token=febb6441-2b6f-45da-b3f2-86c8ba69bea8", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%91%D7%9C%D7%91%D7%95%D7%9C.mp3?alt=media&token=674e57c1-857b-4f41-be64-5e252e02aad5", false, 0, true),      
      new WordClass("", "עצבנות", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2Fangry.PNG?alt=media&token=a04f91a4-6765-47ff-963c-ea70ef319647", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%A2%D7%A6%D7%91%D7%A0%D7%95%D7%AA.mp3?alt=media&token=12f28792-d3b6-478b-ac1b-4396f3633164", false, 0, true),
      new WordClass("", "דאגה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Worry.jpg?alt=media&token=80ba1059-fe6d-4c42-bf50-d592fdd0aa98", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%93%D7%90%D7%92%D7%94.mp3?alt=media&token=fe62daba-5dfd-49df-ac84-8b2f10f267b1", false, 0, true),
      new WordClass("", "מבוכה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/embarrassment.jpg?alt=media&token=5a889dde-6d8e-4668-8303-6bd03ed9bc0d", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%9E%D7%91%D7%95%D7%9B%D7%94.mp3?alt=media&token=be5c213b-760c-408d-887f-832133e71cda", false, 0, true),
      new WordClass("", "אכזבה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/disappointment.jpg?alt=media&token=9f3fb4bf-d1dc-4699-81ea-a4ac1874b9a0", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%90%D7%9B%D7%96%D7%91%D7%94.mp3?alt=media&token=1210d083-6ac9-418c-972e-9825d6fde559", false, 0, true),
      new WordClass("", "בהלה", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Fimages%2Ffreaking_out.PNG?alt=media&token=c5ca7a95-9b57-4e1e-962e-261932d9362c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffeelings%2Faudio%2F%D7%91%D7%94%D7%9C%D7%94.mp3?alt=media&token=a54cda9b-ca2c-40d4-884c-ed5275bd41c8", false, 0, true)
    ];
    this.add_new_cat_to_db(cat, words, [], [], false);

    // //PERSONAL STUFF CATEGORY
    // cat = new CategoryClass("חפצים אישיים", "", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/things.png?alt=media&token=01ce4854-103a-45b2-b9f6-f120d34411ca", this.userEmail, "", 0, false, 4, true)

    // words = [
    //   new WordClass("", "פלאפון", "", "", 0, "", false, 0, true),
    //   new WordClass("", "מפתחות", "", "", 0, "", false, 0, true),
    //   new WordClass("", "שעון יד", "", "", 0, "", false, 0, true),
    //   new WordClass("", "משקפיים", "", "", 0, "", false, 0, true),
    //   new WordClass("", "משקפי שמש", "", "", 0, "", false, 0, true),
    //   new WordClass("", "ארנק", "", "", 0, "", false, 0, true),
    //   new WordClass("", "כסף", "", "", 0, "", false, 0, true),
    //   new WordClass("", "טישו", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fpersonal%20stuff%2Faudio%2F%D7%98%D7%99%D7%A9%D7%95.mp3?alt=media&token=abf1dc2a-98d3-45e0-a4a0-021d8484b4a2", false, 0, true),
    //   new WordClass("", "מקל הליכה", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fpersonal%20stuff%2Faudio%2F%D7%9E%D7%A7%D7%9C%20%D7%94%D7%9C%D7%99%D7%9B%D7%94.mp3?alt=media&token=54bbfada-0e4b-44c1-8bf8-dfcbc1672e78", 0, "", false, 0, true),
    //   new WordClass("", "תרופות", "", "", 0, "", false, 0, true)
    // ];

    // this.add_new_cat_to_db(cat, words, [], [], false);

    //HOLIDAYS
    cat = new CategoryClass("חגים", "", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/holidays.jpg?alt=media&token=0c6b3100-6291-45eb-b646-57cfb76be245", this.userEmail, "", 0, false, 4, true);

    words = [
      new WordClass("", "ראש השנה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/rosh-hashana.jpg?alt=media&token=94d2fb51-741c-4aa1-bd2a-cb32052caea1", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A8%D7%90%D7%A9%20%D7%94%D7%A9%D7%A0%D7%94.mp3?alt=media&token=88320b2a-d712-4bf6-b792-d1a7f2f58518", false, 0, true),      
      new WordClass("", "יום כיפור", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Yom%20Kippur.jpg?alt=media&token=72c96279-3675-4818-a9c7-d5feb0b6542a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%9B%D7%99%D7%A4%D7%95%D7%A8.mp3?alt=media&token=d55e11e3-4bcd-43d4-994e-7ee0401ae81a", false, 0, true),
      new WordClass("", "סוכות", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Sukkot.jpg?alt=media&token=cb319e6b-0491-4198-82df-814087e61adb", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A1%D7%95%D7%9B%D7%95%D7%AA.mp3?alt=media&token=27b993d8-47e0-407e-a927-1efe4e83ba21", false, 0, true),
      new WordClass("", "שמחת תורה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Simchat%20Torah.jpg?alt=media&token=275cbcc9-ffb6-43f6-a5b0-52bee74b6b99", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A9%D7%9E%D7%97%D7%AA%20%D7%AA%D7%95%D7%A8%D7%94.mp3?alt=media&token=8b6c3fdb-b5a4-48d6-bc87-123415f47afd", false, 0, true),
      new WordClass("", "חנוכה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Hanukkah.jpg?alt=media&token=81a18708-439c-4eb7-9bea-022a98265aad", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%97%D7%A0%D7%95%D7%9B%D7%94.mp3?alt=media&token=b17604ce-43f2-4fc9-bdde-d9ab1c0ecb0f", false, 0, true),
      new WordClass("", "טו בשבט", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Tu%20Bishvat.jpg?alt=media&token=adbb30a2-1e1d-4722-b59a-420c096e3cef", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%98%D7%95%20%D7%91%D7%A9%D7%91%D7%98.mp3?alt=media&token=4b88b8f2-f341-4b48-a563-bfead348aebd", false, 0, true),
      new WordClass("", "פורים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Purim.jpg?alt=media&token=6f83a1f0-baad-4b48-8eee-b61f764754d5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%95%D7%A8%D7%99%D7%9D.mp3?alt=media&token=efab9a69-4211-40d3-a415-e8ead0322d6c", false, 0, true),
      new WordClass("", "פסח", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/passover.jpg?alt=media&token=fc5723ac-8c52-47d4-a015-9fa9d5290a4f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%A1%D7%97.mp3?alt=media&token=b355ba49-e050-4f14-a8c3-4127cda3ecaa", false, 0, true),
      new WordClass("", "יום השואה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/holocaust.jpg?alt=media&token=53666129-c401-44bc-b8ee-0c34f05cb939", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%A9%D7%95%D7%90%D7%94.mp3?alt=media&token=d4eff088-a7d2-4773-8536-de55c9ddb1ae", false, 0, true),
      new WordClass("", "יום הזיכרון", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Israel%20Memorial%20Day.jpg?alt=media&token=9411b7cc-2efa-4fb8-836e-864bd583e560", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%96%D7%99%D7%9B%D7%A8%D7%95%D7%9F.mp3?alt=media&token=6c6a4d68-717c-4f75-ade6-f6fbaf73b50a", false, 0, true),
      new WordClass("", "יום העצמאות", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Independence%20Day.jpg?alt=media&token=3b1b799b-4832-4b45-aea7-c4ef1b65987a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%A2%D7%A6%D7%9E%D7%90%D7%95%D7%AA.mp3?alt=media&token=b0b13122-79f9-46f6-8efc-3fc57f680897", false, 0, true),
      new WordClass("", "לג בעומר", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Lomer.jpg?alt=media&token=b4dcd3ed-d9a9-440d-a9b7-87aef01e6e78", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%9C%D7%92%20%D7%91%D7%A2%D7%95%D7%9E%D7%A8.mp3?alt=media&token=209b1d4b-abf6-4fb5-b3e3-54c4099d3eba", false, 0, true),
      new WordClass("", "שבועות", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Pentecost.jpg?alt=media&token=6fb2b01b-ffb1-47ee-bc8a-047c4fa8c39a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A9%D7%91%D7%95%D7%A2%D7%95%D7%AA.mp3?alt=media&token=6088a921-46d2-42b9-9084-42d95b71ff3c", false, 0, true),
      new WordClass("", "תשעה באב", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Tisha%20B'Av.png?alt=media&token=90966665-40b8-4465-8dfc-88f736b991cf", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%AA%D7%A9%D7%A2%D7%94%20%D7%91%D7%90%D7%91.mp3?alt=media&token=55f6732d-4af1-43f5-b081-c63039875ed8", false, 0, true)
    ];

    this.add_new_cat_to_db(cat, words, [], [], false);

    //EVENTS
    cat = new CategoryClass("אירועים", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Ftimes.png?alt=media&token=c24ad512-4d51-4dd1-a47c-c3e3f215a844", this.userEmail, "", 0, false, 5, true);

    words =  [
      new WordClass("", "יום הולדת", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Birthday.jpg?alt=media&token=f845024d-3ea4-4feb-871c-fdab7d0a0b0d", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%95%D7%9C%D7%93%D7%AA.mp3?alt=media&token=053becc3-06a4-413c-b70d-71056c794d89", false, 0, true),
      new WordClass("", "מסיבה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/party.png?alt=media&token=519e79d7-e9d0-433a-a891-1f847aa4a851", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%9E%D7%A1%D7%99%D7%91%D7%94.mp3?alt=media&token=8df1ee8e-035d-4ee5-84b1-b4679c1c7411", false, 0, true),
      new WordClass("", "אירוסין", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/engagement.webp?alt=media&token=e1de6e00-7d7b-4975-bdec-4479ed73358d", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%90%D7%99%D7%A8%D7%95%D7%A1%D7%99%D7%9F.mp3?alt=media&token=af54e688-95e0-4929-be0e-ea6fe77fae4c", false, 0, true),
      new WordClass("", "חתונה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/wedding.jpg?alt=media&token=8b405d58-cfed-4193-9abc-126e75bd44d5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%97%D7%AA%D7%95%D7%A0%D7%94.mp3?alt=media&token=601b0133-761f-4bfc-b534-c1b687dcc96f", false, 0, true),
      new WordClass("", "יום נישואין", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/anniversary.jpg?alt=media&token=dc3fa4d8-9d12-4734-9579-34720b05bfc1", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A0%D7%99%D7%A9%D7%95%D7%90%D7%99%D7%9F.mp3?alt=media&token=c903d077-227d-4906-a67d-a595178d8723", false, 0, true),
      new WordClass("", "גירושין", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/divorce.png?alt=media&token=a9545fd6-317c-4b9d-bcfc-08b9aa8ec3cb", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F.mp3?alt=media&token=d1567413-d8f0-4c46-9ae3-aa8c4f83c9d0", false, 0, true),
      new WordClass("", "בר מצווה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Bar%20Mitzvah.jpg?alt=media&token=59451ab2-b106-49d8-88bd-0d26a401ae5d", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%91%D7%A8%20%D7%9E%D7%A6%D7%95%D7%95%D7%94.mp3?alt=media&token=dbdb01e2-1b38-4df6-982f-d40ed9e6468b", false, 0, true),
      new WordClass("", "בת מצווה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Bat%20Mitzvah.jpg?alt=media&token=6c6d9582-b4ba-4e37-afa7-ecad40969fed", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%91%D7%AA%20%D7%9E%D7%A6%D7%95%D7%95%D7%94.mp3?alt=media&token=09f80923-f9f6-4861-8b0c-686ecde2e0aa", false, 0, true),
      new WordClass("", "ברית", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Brit%20Milah.jpg?alt=media&token=2a4a17f7-725b-4d10-a3c4-713cfb3b4022", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%91%D7%A8%D7%99%D7%AA.mp3?alt=media&token=00946d92-cc0d-4f65-b335-0e40d4cf9047", false, 0, true),
      new WordClass("", "זבד הבת", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Femalecelebration.jpg?alt=media&token=781f7c82-bcd4-4b88-b7e3-568347c65a30", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%96%D7%91%D7%93%20%D7%94%D7%91%D7%AA.mp3?alt=media&token=fffd111d-1c31-45ac-9621-29f338ac2560", false, 0, true),
      new WordClass("", "הלוויה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/funeral.jpg?alt=media&token=5280be60-da61-407f-8050-01e83f5a4200", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%94%D7%9C%D7%95%D7%95%D7%99%D7%94.mp3?alt=media&token=7c7832e9-e15e-4a07-8b9d-c0a9e4383e6f", false, 0, true),
      new WordClass("", "אזכרה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/memorial.jpg?alt=media&token=ca390130-bba8-4ffb-b98d-edd7e08a1d59", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%90%D7%96%D7%9B%D7%A8%D7%94.mp3?alt=media&token=74240be0-48c4-417c-8ed9-f43df8be7c1c", false, 0, true),
      new WordClass("", "שבעה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/shiva.jpg?alt=media&token=009c30ab-a8f2-4623-a32b-4a2b66fb9eb4", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%A9%D7%91%D7%A2%D7%94.mp3?alt=media&token=e8f4384a-347a-4816-bb06-52d686d15a13", false, 0, true),
      new WordClass("", "גיוס לצבא", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/army.png?alt=media&token=acd02391-6b42-4ca9-a2df-493a2ff525f2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%92%D7%99%D7%95%D7%A1%20%D7%9C%D7%A6%D7%91%D7%90.mp3?alt=media&token=85bc6bc7-6264-4771-9018-fa5953df31c0", false, 0, true),
      new WordClass("", "טקס סיום", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/graduation%20ceremony.jpg?alt=media&token=4c87d7cd-2fb0-4e51-a035-7fd810997c4e", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%98%D7%A7%D7%A1%20%D7%A1%D7%99%D7%95%D7%9D.mp3?alt=media&token=3a52dffe-57af-44e5-be4b-b39570572743", false, 0, true)
    ];
    this.add_new_cat_to_db(cat, words, [], [], false);

    cat = new CategoryClass("מספרים", "", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/numbers.jpg?alt=media&token=7ce920fd-3b2c-49e8-a5db-a4c89c650c19", this.userEmail, "", 0, false, 5, true);

    words =  [
    new WordClass("", "1-אחד", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/1.webp?alt=media&token=5329d848-61e3-41e8-85b0-7e3d4a40c297", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%90%D7%97%D7%93.mp3?alt=media&token=b84b9d66-0a6c-4d41-a43d-e6fdc91c19aa", false, 0, true),
        new WordClass("", "2-שתיים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/2.jpg?alt=media&token=09aa087c-f9a7-4d49-bff5-11eee6c9d94a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%AA%D7%99%D7%99%D7%9D.mp3?alt=media&token=fc05f7c5-e475-4cf7-b627-fb608a494c84", false, 0, true),
        new WordClass("", "3-שלוש", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/3.jpg?alt=media&token=443eec37-f5e3-49e4-b235-b74e1e8347f9", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%9C%D7%95%D7%A9.mp3?alt=media&token=7278486b-cb7d-4723-a8ab-2d61f31abf1b", false, 0, true),
        new WordClass("", "4-ארבע", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/4.webp?alt=media&token=8c36eceb-cf3e-49c0-96ae-049e864cc6b8", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%90%D7%A8%D7%91%D7%A2.mp3?alt=media&token=5b92f457-ac22-4dc4-b4e4-46c7e77e2457", false, 0, true),
        new WordClass("", "5-חמש", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/5.jpg?alt=media&token=ef7004c6-1554-43bf-9fc4-9da2657ad6d0", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%97%D7%9E%D7%A9.mp3?alt=media&token=64254bb5-24cf-4584-ab1f-c9ea5dc7701c", false, 0, true),
        new WordClass("", "6-שש", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/6.jpg?alt=media&token=39cd3077-2353-4a0e-9137-bebcf8aec38c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%A9.mp3?alt=media&token=aab257a4-a38f-4718-8b27-ca9a9728e0b5", false, 0, true),
        new WordClass("", "7-שבע", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/7.webp?alt=media&token=61054b38-2284-4110-9736-0c364abc2c30", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%91%D7%A2.mp3?alt=media&token=6cffd7da-1ac9-4209-a901-81133626755d", false, 0, true),
        new WordClass("", "8-שמונה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/8.jpg?alt=media&token=44c2091f-68be-464f-a918-701231d32c1f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%9E%D7%95%D7%A0%D7%94.mp3?alt=media&token=24f6ae3d-3b0a-4268-b9a0-17ffbfd4d852", false, 0, true),
        new WordClass("", "9-תשע", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/9.jpg?alt=media&token=36a3a5ba-300e-4daf-8265-380b2f5797fa", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%AA%D7%A9%D7%A2.mp3?alt=media&token=f7c4c7ee-8f87-4868-8ab9-7c92d31d59fc", false, 0, true),
        new WordClass("", "10-עשר", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/10.webp?alt=media&token=f91af605-a9f2-4f85-88f7-c7f07c894014", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A2%D7%A9%D7%A8.mp3?alt=media&token=3a6cb692-7994-489e-9ba2-5346594fdfea", false, 0, true),
  ];

    this.add_new_cat_to_db(cat, words, [], [], false);

    //BODY PARTS
    cat = new CategoryClass("אברי גוף", "", "", this.userEmail, "", 0, false, 0, true);

    words =
     [ // אברי גוף
      new WordClass("", "אצבעות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%A6%D7%91%D7%A2%D7%95%D7%AA.mp3?alt=media&token=9855dd26-3f35-406f-bb17-acc87a324846", false, 0, true),
      new WordClass("", "יד", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%99%D7%93.mp3?alt=media&token=f5089854-f9b9-4825-879b-5ad431f72cb9", false, 0, true),
      new WordClass("", "רגל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A8%D7%92%D7%9C.mp3?alt=media&token=70041eb4-fb65-456c-ab19-8d2472625387", false, 0, true),
      new WordClass("", "ראש", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A8%D7%90%D7%A9.mp3?alt=media&token=4b9a23bb-1d01-4605-aca2-f3066ad18c43", false, 0, true),
      new WordClass("", "עיניים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A2%D7%99%D7%A0%D7%99%D7%99%D7%9D%20.mp3?alt=media&token=bbbc64ba-817b-4dff-b2c7-3d5bf9014d43", false, 0, true),
      new WordClass("", "אוזן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%95%D7%96%D7%9F.mp3?alt=media&token=9fc4d5ec-df8d-43c9-9281-7e700486db08", false, 0, true),
      new WordClass("", "אף", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%A3.mp3?alt=media&token=85731fe3-eafc-4b39-b316-36bdcf2c114d", false, 0, true),
      new WordClass("", "שיניים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A9%D7%99%D7%A0%D7%99%D7%99%D7%9D.mp3?alt=media&token=ac0e5c14-c1da-4256-b420-85d6ae45c35c", false, 0, true),
      new WordClass("", "בטן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%91%D7%98%D7%9F.mp3?alt=media&token=bf72ac04-21db-4e99-98b2-5b78f4bcc14e", false, 0, true),
      new WordClass("", "גב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%92%D7%91.mp3?alt=media&token=4e4152f3-2ada-4954-ab71-65d139f44590", false, 0, true),
      new WordClass("", "לב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%9C%D7%91.mp3?alt=media&token=ab558135-3572-4dc6-9bc3-b67a679119fe", false, 0, true),
      new WordClass("", "חזה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%97%D7%96%D7%94.mp3?alt=media&token=f14d1553-7630-4bb7-9a4e-78c1073382fb", false, 0, true),
      new WordClass("", "איבר מין", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/sex.png?alt=media&token=e5424496-897d-4949-a296-7f94db38b51b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%99%D7%91%D7%A8%20%D7%9E%D7%99%D7%9F.mp3?alt=media&token=6f1c19b7-28bb-4fa5-a2a5-dde66f336b54", false, 0, true),
      new WordClass("", "ישבן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%99%D7%A9%D7%91%D7%9F.mp3?alt=media&token=3362ff09-e621-4eac-bfa7-98c15981fe01", false, 0, true)
    ];

    this.add_new_cat_to_db(cat, words, [], [], false);

    //PROFFESIONS
    cat = new CategoryClass("אנשי מקצוע", "", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/professional.jpg?alt=media&token=f5f18821-e2d6-44f7-bdf3-25620f695436", this.userEmail, "", 0, false, 0, true);

    words =
    [ 
      new WordClass("", "רופא משפחה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/family_doctor.jpg?alt=media&token=dd2466cc-660e-4116-81ed-681c38fbcfe6", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A8%D7%95%D7%A4%D7%90%20%D7%9E%D7%A9%D7%A4%D7%97%D7%94.mp3?alt=media&token=b874921f-cb12-47a5-aada-543f51e2ec13", false, 0, true),
      new WordClass("", "נוירולוג", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/neurologist.jpg?alt=media&token=4a7db216-7c8c-49c1-972c-bc00601afa23", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A0%D7%95%D7%99%D7%A8%D7%95%D7%9C%D7%95%D7%92.mp3?alt=media&token=c5589221-c7cf-4a3f-a1d1-20a0b25b6d60", false, 0, true),
      new WordClass("", "קרדיולוג", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/cardiologist.jpg?alt=media&token=8bd56ae2-3b8a-477f-b94b-f66bdc70e950", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A7%D7%A8%D7%93%D7%99%D7%95%D7%9C%D7%95%D7%92.mp3?alt=media&token=4850d5ce-5120-4fe3-8476-2b128df1fea9", false, 0, true),
      new WordClass("", "אף אוזן גרון", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/ear_nose.jpg?alt=media&token=85978cca-a59d-45a0-a93e-cd30ce68df06", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F.mp3?alt=media&token=d36ee650-ab4e-4df3-8469-e94e9e4616c7", false, 0, true),
      new WordClass("", "רופא עיניים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/ophthalmologist.jpg?alt=media&token=6c8cb9ae-4a95-437f-ba53-7b704366fd9b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A8%D7%95%D7%A4%D7%90%20%D7%A2%D7%99%D7%A0%D7%99%D7%99%D7%9D.mp3?alt=media&token=d682c09a-2ead-47da-84a8-a7717936bbaa", false, 0, true),
      new WordClass("", "רופא עור", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/skin_doctor.jpg?alt=media&token=3cb53bb6-525a-4a7e-8c58-ba851b0c1b48", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A8%D7%95%D7%A4%D7%90%20%D7%A2%D7%95%D7%A8.mp3?alt=media&token=683f1e48-48e2-4989-8a5b-98abe83be167", false, 0, true),
      new WordClass("", "קלינאי/ת תקשורת", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/speech_therapist.jpg?alt=media&token=fb886ba7-ef46-46fa-8057-d0f321e604ca", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A7%D7%9C%D7%99%D7%A0%D7%90%D7%99%D7%AA%20%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA.mp3?alt=media&token=0f8ad72a-8df1-40a9-9350-7bb89c426b52", false, 0, true),
      new WordClass("", "פיזיותרפיה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/physiotherapist.jpg?alt=media&token=83c9a3f4-69ab-44fc-a4fa-098ff544257f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A4%D7%99%D7%96%D7%99%D7%95%D7%AA%D7%A8%D7%A4%D7%99%D7%94.mp3?alt=media&token=fa34bb46-8848-4c07-bbd2-0d2887eeb303", false, 0, true),
      new WordClass("", "ריפוי בעיסוק", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/occupational_therapy.jpg?alt=media&token=8d89485c-9557-4d07-ae8d-c813990e5a5a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A8%D7%99%D7%A4%D7%95%D7%99%20%D7%91%D7%A2%D7%99%D7%A1%D7%95%D7%A7.mp3?alt=media&token=7e7bc9d0-aea7-452a-9642-52c45318851d", false, 0, true),
      new WordClass("", "דיאטנית", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/dietitian.jpg?alt=media&token=59deb36b-735c-4291-8c5b-cc232c54d74f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%93%D7%99%D7%90%D7%98%D7%A0%D7%99%D7%AA.mp3?alt=media&token=6292bc78-ffe9-41fb-86b8-3ee561684c9a", false, 0, true),
    ];

    this.add_new_cat_to_db(cat, words, [], [], false);

    //PLACES
    cat = new CategoryClass("מקומות", "", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/places.png?alt=media&token=97113d17-28ab-43b0-beb6-bbb43c3792a0", this.userEmail, "", 0, false, 2, true);

    words =
    [
      new WordClass("", "קונצרט", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/concert.jpg?alt=media&token=35a4a017-6a2a-476a-85d6-18556952b4f7", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A7%D7%95%D7%A0%D7%A6%D7%A8%D7%98.mp3?alt=media&token=580fa79b-17df-4501-b503-15286403b0f7", false, 0, true),
      new WordClass("", "מוזיאון", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/museum.jpg?alt=media&token=97d662cb-1aa9-422b-b4a5-17c5a01627cb", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%9E%D7%95%D7%96%D7%99%D7%90%D7%95%D7%9F.mp3?alt=media&token=7f1200fa-118f-416b-a29c-cd02f7a8d50a", false, 0, true),
      new WordClass("", "תיאטרון", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/theater.jpg?alt=media&token=43012817-2f21-45f7-be31-1f1a524cd220", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%AA%D7%99%D7%90%D7%98%D7%A8%D7%95%D7%9F.mp3?alt=media&token=ea3e9124-63e5-459b-987f-1ce075705c8b", false, 0, true),
      new WordClass("", "הופעה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Performance.webp?alt=media&token=70fa4edb-0dab-4557-93ef-dcfd3ce4d3be", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%94%D7%95%D7%A4%D7%A2%D7%94.mp3?alt=media&token=dabc01a8-2cb2-47f0-a17a-2e00541e1667", false, 0, true),
      new WordClass("", "קןלנוע", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/cinema.jpg?alt=media&token=741f997e-bd39-40a8-a32a-7dcceb8e31a3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A7%D7%95%D7%9C%D7%A0%D7%95%D7%A2.mp3?alt=media&token=4b8dd6de-172b-4bb8-b526-234c3fd746f0", false, 0, true),
      new WordClass("", "מסעדה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Restaurant.jpg?alt=media&token=4cf74188-98b8-48b9-afcb-3065bbedaa19", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%9E%D7%A1%D7%A2%D7%93%D7%94.mp3?alt=media&token=a7af46a2-8a29-4b7f-a4f6-7c411037bf5e", false, 0, true),
      //new WordClass("", "טיול", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%98%D7%99%D7%95%D7%9C.mp3?alt=media&token=6a907618-3979-459b-a62f-6882358da7ab", false, 0, true),
     // new WordClass("", 'חו"ל', "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%97%D7%95%D7%9C.mp3?alt=media&token=e5bb056e-9a5c-4633-9589-528984b38fa9", false, 0, true),
    //new WordClass("", "קניות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A7%D7%A0%D7%99%D7%95%D7%AA.mp3?alt=media&token=16b8e15e-b0de-4063-9cb0-3001d2352c62", false, 0, true),
      new WordClass("", "פיקניק", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/picnic.jpg?alt=media&token=292475bf-cee7-49df-ab90-dce9bd72923b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%99%D7%A7%D7%A0%D7%99%D7%A7.mp3?alt=media&token=b9e2ea0d-2fd6-4ab5-8702-c3c7ba1cee41", false, 0, true),
      new WordClass("", "פארק", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/park.jpg?alt=media&token=50f424f1-ca7d-4c46-b08a-4aa3a156c293", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%90%D7%A8%D7%A7.mp3?alt=media&token=01e85dc0-43ad-49c6-88c3-90b96b11ca8f", false, 0, true),
      new WordClass("", "ים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/sea.jpg?alt=media&token=c98c2a3e-ecc2-4325-b82f-eab80902cc35", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%99%D7%9D.mp3?alt=media&token=55746758-5e22-403e-992d-240c4fb09218", false, 0, true),
      new WordClass("", "דואר", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/post%20office.jpg?alt=media&token=48c94ebb-6a9a-4f0e-8e9e-f04c631953e3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%93%D7%95%D7%90%D7%A8.mp3?alt=media&token=9efaecf4-02a9-44f8-a746-18e91e0d5569", false, 0, true),
      new WordClass("", "סופרמרקט", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/supermarket.jpg?alt=media&token=dc0e345b-f89c-4400-8f3c-e58c4378546b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98.mp3?alt=media&token=d33f2ba1-ce0e-4ddf-984d-b2124b2a2ae2", false, 0, true),
      new WordClass("", "בית חולים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Hospital.jpg?alt=media&token=e14e4b0e-fd32-4238-bae2-36d541c21f1a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%99%D7%AA%20%D7%97%D7%95%D7%9C%D7%99%D7%9D.mp3?alt=media&token=3d808039-f3bf-4731-92ba-d718415390cd", false, 0, true),
      new WordClass("", "קופת חולים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/HMO.jpg?alt=media&token=35f30faa-ba15-4cff-b19b-09bb3a0db8fc", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%A7%D7%95%D7%A4%D7%AA%20%D7%97%D7%95%D7%9C%D7%99%D7%9D.mp3?alt=media&token=a294c3c1-b0b0-4bc5-8fe2-3df2cf8c57f3", false, 0, true),
      new WordClass("", "קניון", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/shopping%20mall.jpg?alt=media&token=46fad44e-4c1f-468b-a8bf-0f2d164fb656", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%A7%D7%A0%D7%99%D7%95%D7%9F.mp3?alt=media&token=f84b9a89-4235-438c-8fc5-ade0542055e5", false, 0, true),
      new WordClass("", "בית כנסת", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Synagogue.jpg?alt=media&token=153162d7-d2cf-441a-bc53-c7ec522033b0", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%99%D7%AA%20%D7%9B%D7%A0%D7%A1%D7%AA.mp3?alt=media&token=a25fb311-3ea0-43e8-a64b-38e18fc027ba", false, 0, true),
      new WordClass("", "חנות", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/store.webp?alt=media&token=e85aacfb-3409-4b56-8e3c-1b059a893aa3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%97%D7%A0%D7%95%D7%AA.mp3?alt=media&token=3cd04258-7564-4cd6-82ba-860e0a794e7f", false, 0, true),
      new WordClass("", "בית מלון", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Hotel.jpg?alt=media&token=259d832d-e2b2-422c-b0b0-ac16c8de8c7f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%99%D7%AA%20%D7%9E%D7%9C%D7%95%D7%9F.mp3?alt=media&token=9f072739-d1c1-4047-8fed-e119f4d438f3", false, 0, true),
      new WordClass("", "מספרה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Barbershop.jpg?alt=media&token=d760ef31-1237-46e7-b0b4-e680befdb709", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%9E%D7%A1%D7%A4%D7%A8%D7%94.mp3?alt=media&token=48faf48b-4b48-4c0d-ad3c-04aa8d1b8002", false, 0, true),
      new WordClass("", "מוסך", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%9E%D7%95%D7%A1%D7%9A.mp3?alt=media&token=4a4f81fc-bf12-4517-8de0-4ff9506423a0", false, 0, true),
      new WordClass("", "חדר כושר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%97%D7%93%D7%A8%20%D7%9B%D7%95%D7%A9%D7%A8.mp3?alt=media&token=44b01dd3-ff01-4a5d-97a9-71f1481f3ef2", false, 0, true),
      new WordClass("", "בריכה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%A8%D7%99%D7%9B%D7%94.mp3?alt=media&token=4588c5a9-b51e-430b-a76c-e0d3e43ba7eb", false, 0, true),
      new WordClass("", "בנק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%A0%D7%A7.mp3?alt=media&token=b4be1fa7-376e-4b97-bb8b-2331e8a0ac32", false, 0, true),
      // new WordClass("", "סלון", "", "", 0, "", false, 0, true),
      // new WordClass("", "מטבח", "", "", 0, "", false, 0, true),
      // new WordClass("", "שירותים", "", "", 0, "", false, 0, true),
      // new WordClass("", "אמבטיה", "", "", 0, "", false, 0, true),
      // new WordClass("", "חדר שינה", "", "", 0, "", false, 0, true),
      // new WordClass("", "חדר ילדים", "", "", 0, "", false, 0, true),
      new WordClass("", "גינה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Froom%20at%20home%2Faudio%2F%D7%92%D7%99%D7%A0%D7%94.mp3?alt=media&token=79f9a8f2-9e01-4b02-af54-f4f0681bec9e", false, 0, true),
      new WordClass("", "מרפסת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Froom%20at%20home%2Faudio%2F%D7%9E%D7%A8%D7%A4%D7%A1%D7%AA.mp3?alt=media&token=8d27532c-7fbe-4235-b681-35c05645788f", false, 0, true),
      new WordClass("", "מחסן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Froom%20at%20home%2Faudio%2F%D7%9E%D7%97%D7%A1%D7%9F.mp3?alt=media&token=d4240582-5752-491c-a6c3-a8ec9a0ba933", false, 0, true)
    ];

    this.add_new_cat_to_db(cat, words, [], [], false);

    //FOOD
    cat = new CategoryClass("אוכל", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Fimages%2Ffood.PNG?alt=media&token=783e6cf9-688f-4a9c-afc4-4b5daec31023", this.userEmail, "", 0, false, 2, true);


    words =
    
      [
      new WordClass("", "חלב", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/milk.jpg?alt=media&token=002e1b44-f130-4192-b778-f658e32a86d3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%97%D7%9C%D7%91.mp3?alt=media&token=02cbe1ca-503b-402f-9a31-f3156f8985f2", false, 0, true),
      new WordClass("", "גבינה לבנה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/cream_cheese.jpg?alt=media&token=486363d9-3208-4464-8850-161be307c0f5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%92%D7%91%D7%99%D7%A0%D7%94%20%D7%9C%D7%91%D7%A0%D7%94.mp3?alt=media&token=efc5e008-0ba3-4379-b8e7-f31749ccd03d", false, 0, true),
      new WordClass("", "יוגורט", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/yogurt.jpg?alt=media&token=1a920194-dc69-4648-aa0b-ff227a74ef6b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%99%D7%95%D7%92%D7%95%D7%A8%D7%98.mp3?alt=media&token=b99d6f8a-6f51-4199-a4dc-ba316e8c7fa9", false, 0, true),
      new WordClass("", "גבינה צהובה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/yellow_cheese.jpg?alt=media&token=24e7a98c-d42c-4d38-b653-249a94b98409", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%92%D7%91%D7%99%D7%A0%D7%94%20%D7%A6%D7%94%D7%95%D7%91%D7%94.mp3?alt=media&token=df1f7ef5-a09c-450d-bd64-9f2d4d75cee7", false, 0, true),      
      new WordClass("", "קוטג'", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/cottage'.jpg?alt=media&token=1768e8e0-cb05-48b5-a0f1-990c864f455c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%A7%D7%95%D7%98%D7%92'.mp3?alt=media&token=c1dbbe70-ccf5-4a40-9b19-f36424132708", false, 0, true),
      new WordClass("", "ביצים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/eggs.jpg?alt=media&token=4e88b203-c9d9-4551-b472-c4fd8c7f64bd", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%91%D7%99%D7%A6%D7%99%D7%9D.mp3?alt=media&token=d3c967c4-e573-48ea-894d-9278a550bc6a", false, 0, true),
      new WordClass("", "חמאה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/butter.jpg?alt=media&token=a0bc9f61-4d19-479a-b0e0-f8b00d5909de", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%97%D7%9E%D7%90%D7%94.mp3?alt=media&token=ecde95f3-d486-43fd-badc-95979ae252cc", false, 0, true),
      new WordClass("", "מעדן", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/delicacy.jpg?alt=media&token=325d66e3-f984-4600-b7d7-0db948d93a42", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%9E%D7%A2%D7%93%D7%9F.mp3?alt=media&token=c10b0cc0-fe24-4044-91d4-9b96804dfbcb", false, 0, true),
      new WordClass("", "בשר", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/meat.jpg?alt=media&token=1442678f-8032-48d6-a2c3-2079ccc1c3e5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%91%D7%A9%D7%A8.mp3?alt=media&token=d83b5880-aba7-47e6-8c4c-5e3b0e9f40f5", false, 0, true),
      new WordClass("", "קציצות", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/meat_ball.jpg?alt=media&token=cc4ee52f-2759-44ae-a43d-637606c76a20", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A7%D7%A6%D7%99%D7%A6%D7%95%D7%AA.mp3?alt=media&token=914e4f1d-af43-4fd7-a3e2-2f55f222c6f5", false, 0, true),
      new WordClass("", "עוף", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/chicken.jpg?alt=media&token=203ffe3a-3d55-43cc-9920-9c75d721de21", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A2%D7%95%D7%A3.mp3?alt=media&token=bcb8e1cd-05f6-4e19-8661-0fd3b9420900", false, 0, true),
      new WordClass("", "דג", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/fish.jpg?alt=media&token=6fb7c2c0-c1dd-4b44-a7fd-78382dc01241", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%93%D7%92.mp3?alt=media&token=01ad8363-e9a0-4d53-85bc-7493486df809", false, 0, true),
      new WordClass("", "טונה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/tuna.jpg?alt=media&token=8dd87811-cbf4-48c7-8db1-9c829ca031f4", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%98%D7%95%D7%A0%D7%94.mp3?alt=media&token=4d87b233-6f14-4a57-8ae0-8d7371800a94", false, 0, true),
      new WordClass("", "אורז", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/rice.jpg?alt=media&token=6a20ad0d-bd2f-4218-ac80-58eb33286790", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%90%D7%95%D7%A8%D7%96.mp3?alt=media&token=c61a5057-fe6a-4d6c-b8a1-1bc4034acde1", false, 0, true),
      new WordClass("", "פסטה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/pasta.jpg?alt=media&token=d818eaaa-b3bd-4c5b-84e0-9c91f1618f07", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%A1%D7%98%D7%94.mp3?alt=media&token=c537efc6-8142-45f3-91cc-30bac420f7bb", false, 0, true),
      new WordClass("", "מרק", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/soup.jpg?alt=media&token=040745e0-7d53-4050-bf21-14fd14b8c02c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%9E%D7%A8%D7%A7.mp3?alt=media&token=c7fb70c3-6fce-4922-8fff-35e03555bd02", false, 0, true),
      new WordClass("", "חביתה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/omlet.jpg?alt=media&token=623011dc-d510-4f7b-8ffd-c93f458e5340", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%97%D7%91%D7%99%D7%AA%D7%94.mp3?alt=media&token=6a4df95f-0736-4acd-9946-f76c1a39a120", false, 0, true),
      new WordClass("", "סלט", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/salad.jpg?alt=media&token=e449340f-69c7-452e-a2a8-15cf67c3b3e2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A1%D7%9C%D7%98.mp3?alt=media&token=a46c5785-74b8-409d-842d-5d120fe80250", false, 0, true),
      new WordClass("", "פתיתים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/Ptitim.jpg?alt=media&token=7fe77a93-2323-4f1d-ad48-205c6c032792", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%AA%D7%99%D7%AA%D7%99%D7%9D.mp3?alt=media&token=deba197b-5647-45d4-9357-2071bc03270b", false, 0, true),
      new WordClass("", "פירה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/puree.jpg?alt=media&token=c24d0fc2-511f-42c0-b343-8ae030f1007f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%99%D7%A8%D7%94.mp3?alt=media&token=4df04dab-2a28-40a9-b196-17085402fa4b", false, 0, true),
      new WordClass("", "פיתה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/pita.jpg?alt=media&token=cfb3ddd1-cb1b-4765-8b06-ec45dcb02fe8", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%A4%D7%99%D7%AA%D7%94.mp3?alt=media&token=e283db0f-00ef-46c4-8c12-57f44b3ea521", false, 0, true),
      new WordClass("", "טוסט", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/toast.jpg?alt=media&token=fd91f821-20e7-4561-92ad-e863fec5f656", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%98%D7%95%D7%A1%D7%98.mp3?alt=media&token=5afa3ffb-c956-4132-84bc-dfefc938b977", false, 0, true),
      new WordClass("", "עוגה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/cake.jpg?alt=media&token=0667bd2f-f24e-4af7-936d-1855a254daba", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A7%D7%99%D7%A0%D7%95%D7%97%D7%99%D7%9D%2F%D7%A2%D7%95%D7%92%D7%94.mp3?alt=media&token=9d020fbc-6b49-4172-a365-c5c4208405c1", false, 0, true),
      new WordClass("", "עוגיות", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/cookies.jpg?alt=media&token=74855c8f-6fff-4cb8-8476-f9a6c9fa039f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A7%D7%99%D7%A0%D7%95%D7%97%D7%99%D7%9D%2F%D7%A2%D7%95%D7%92%D7%99%D7%95%D7%AA.mp3?alt=media&token=c5a1f1f2-30b2-4ac4-ae4d-28f3e4bd7558", false, 0, true),
      new WordClass("", "גלידה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/ice_cream.jpg?alt=media&token=745e1035-a34f-4a57-99ae-00a85d22d065", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A7%D7%99%D7%A0%D7%95%D7%97%D7%99%D7%9D%2F%D7%92%D7%9C%D7%99%D7%93%D7%94.mp3?alt=media&token=f536cd95-04db-45e0-a2a9-02b2650530cb", false, 0, true),
      new WordClass("", "מים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/water.jpg?alt=media&token=4e1d45de-2526-4637-8e54-dd46fd3eaffe", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%9E%D7%99%D7%9D.mp3?alt=media&token=cddbf894-5db8-46de-802f-e202c3ef98e8", false, 0, true),
      new WordClass("", "סודה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/soda.jpg?alt=media&token=a509bb4a-481c-469e-9c8f-d01b49a31fa1", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%A1%D7%95%D7%93%D7%94.mp3?alt=media&token=d2bfc6ef-7886-4f22-97d8-ff2ef666d0b1", false, 0, true),
      new WordClass("", "קפה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/coffee.jpg?alt=media&token=e0b31aaa-330d-454c-9122-e492c27b1ecf", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%A7%D7%A4%D7%94.mp3?alt=media&token=830fe69c-5450-4ad4-83fb-39d26531c943", false, 0, true),
      new WordClass("", "תה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/tea.jpg?alt=media&token=1eebe734-4049-470e-b2ba-5127cf2e892a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%AA%D7%94.mp3?alt=media&token=b998f5b7-78fb-42dc-bdbc-f4c1068a23ec", false, 0, true),
      new WordClass("", "עגבניה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/tomato.jpg?alt=media&token=ba68e63c-fb16-4711-86fa-2da03a9f3c96", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%94.mp3?alt=media&token=bee3602b-c484-40d6-9155-e193144fb336", false, 0, true),
      new WordClass("", "גמבה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/gamba.jpg?alt=media&token=86bd7819-360e-4daf-9682-11e25c496788", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%92%D7%9E%D7%91%D7%94.mp3?alt=media&token=c311d4e1-8688-43e1-874a-1f3895c609a9", false, 0, true),
      new WordClass("", "בצל", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/onion.jpg?alt=media&token=9c6e1a66-95b8-40bd-aa20-89d8b4070472", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%91%D7%A6%D7%9C.mp3?alt=media&token=ed894f8d-66b1-4ae4-a205-6312c1084cb7", false, 0, true),
      new WordClass("", "חסה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/lettuce.jpg?alt=media&token=0054aaca-025a-49b8-a376-af53b25ebed0", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%97%D7%A1%D7%94.mp3?alt=media&token=8656e314-cc61-4350-979f-0f102868da8f", false, 0, true),
      new WordClass("", "גזר", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/carrot.jpg?alt=media&token=c03baae0-8095-4bbe-aa38-e9e4f1e051ca", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%92%D7%96%D7%A8.mp3?alt=media&token=da8b8201-3191-4bf3-a905-226775490614", false, 0, true),
      new WordClass("", "תפוח", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/apple.jpg?alt=media&token=5e49a4f0-fd1c-485d-aa23-fa79e76dc4ca", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%AA%D7%A4%D7%95%D7%97.mp3?alt=media&token=621a5491-f3c1-4872-9712-27b1f2f6ef29", false, 0, true),
      new WordClass("", "תפוז", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/orange.jpg?alt=media&token=082ec97f-a0bb-4136-8d6b-de89b9dcb117", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%AA%D7%A4%D7%95%D7%96.mp3?alt=media&token=0f69d6d9-4172-47e7-9897-78f5980c97fc", false, 0, true),
      new WordClass("", "ענבים", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/grapes.jpg?alt=media&token=7a674859-8a80-4bec-96d5-523e38bd6069", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%A2%D7%A0%D7%91%D7%99%D7%9D.mp3?alt=media&token=ad263839-8c2a-49e2-977a-15b0f8dbf91a", false, 0, true),
      new WordClass("", "אבטיח", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/water_mellon.jpg?alt=media&token=6f5b5113-cb66-4407-af3f-860dd50cbe7b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%90%D7%91%D7%98%D7%99%D7%97.mp3?alt=media&token=f21de5a8-de87-4a74-adf0-e4f83a07170c", false, 0, true),
      new WordClass("", "בננה", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/banana.jpg?alt=media&token=5c195ce8-4a81-4f5c-bab3-3f0c48ebd01b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%91%D7%A0%D7%A0%D7%94.mp3?alt=media&token=77d1c70f-58ba-4a2c-a645-cd2dd25f5d1c", false, 0, true),
      new WordClass("", "חומוס", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/humus.jpg?alt=media&token=9f2058f0-1138-413d-ab44-3118ed1b5d7a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%97%D7%95%D7%9E%D7%95%D7%A1.mp3?alt=media&token=f85a7210-dcdd-45fc-8a1a-4b0de4beffd8", false, 0, true),
      new WordClass("", "ממרח שוקולד", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/chocolate.jpg?alt=media&token=d70a6770-f47b-49dc-993e-0fe1d6b36a44", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%9E%D7%9E%D7%A8%D7%97%20%D7%A9%D7%95%D7%A7%D7%95%D7%9C%D7%93.mp3?alt=media&token=b8371f98-5efe-4014-bdb4-ee48686de65c", false, 0, true),
      new WordClass("", "מלח", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/salt.jpg?alt=media&token=0659a1d7-4042-4b3d-aa5d-20b0645c6a7c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%9E%D7%9C%D7%97.mp3?alt=media&token=41f7b647-a758-4d25-8d70-ee737991c65b", false, 0, true),
      new WordClass("", "פלפל שחור", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/pepper.jpg?alt=media&token=9113c45e-2dbd-47e7-bc18-d0ef8bc8c378", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%A4%D7%9C%D7%A4%D7%9C%20%D7%A9%D7%97%D7%95%D7%A8.mp3?alt=media&token=75d1221d-31c9-4f7b-94b1-5c6cdb26320c", false, 0, true),
   ];

    this.add_new_cat_to_db(cat, words, [], [], false);

  



    //TIMES CATEGORY
    // cat = new CategoryClass("זמן", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Ftimes.png?alt=media&token=c24ad512-4d51-4dd1-a47c-c3e3f215a844", this.userEmail, "", 0, false, 1, true)
    // words = [];
    // subCats = [
    //   new CategoryClass("ימות השבוע", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Fday.png?alt=media&token=92e0ecd2-1435-438f-8528-d6c14fcb1b08", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("מספרים", "", "", this.userEmail, "", 0, false, 1, true),
    //   new CategoryClass("חודשים עבריים", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Fmonth.png?alt=media&token=678700df-b2ee-4dc4-a08b-6c492cf8d50e", this.userEmail, "", 0, false, 2, true),
    //   new CategoryClass("חודשים לועזיים", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Fmonth.png?alt=media&token=678700df-b2ee-4dc4-a08b-6c492cf8d50e", this.userEmail, "", 0, false, 3, true),
    //   new CategoryClass("חגים", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Ftimes.png?alt=media&token=c24ad512-4d51-4dd1-a47c-c3e3f215a844", this.userEmail, "", 0, false, 4, true),
    //   new CategoryClass("אירועים", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Ftimes.png?alt=media&token=c24ad512-4d51-4dd1-a47c-c3e3f215a844", this.userEmail, "", 0, false, 5, true)
    // ]

    // subPhrases = [
    //   [
    //     new WordClass("", "ראשון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A8%D7%90%D7%A9%D7%95%D7%9F.mp3?alt=media&token=55c85597-7084-4daf-90a7-f3e343b95a54", false, 0, true),
    //     new WordClass("", "שני", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A9%D7%A0%D7%99.mp3?alt=media&token=7dfe1786-0933-4231-9142-c5c550a45aa6", false, 0, true),
    //     new WordClass("", "שלישי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A9%D7%9C%D7%99%D7%A9%D7%99.mp3?alt=media&token=a9be431d-2813-493b-a27b-2f34c9fcc18e", false, 0, true),
    //     new WordClass("", "רביעי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A8%D7%91%D7%99%D7%A2%D7%99.mp3?alt=media&token=4f9ad981-ae91-4a80-9882-a3e4de859716", false, 0, true),
    //     new WordClass("", "חמישי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%97%D7%9E%D7%99%D7%A9%D7%99.mp3?alt=media&token=e1d36d86-e85a-48ee-9ae9-d15014d174ad", false, 0, true),
    //     new WordClass("", "שישי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A9%D7%99%D7%A9%D7%99.mp3?alt=media&token=49eef202-a932-43f9-b47c-40e829a43a0a", false, 0, true),
    //     new WordClass("", "שבת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A9%D7%91%D7%AA.mp3?alt=media&token=36b85562-ba44-403d-b9ef-0e55c6d0d389", false, 0, true),
    //     new WordClass("", "אתמול", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2F%25E2%2580%258F%25E2%2580%258Fprev.PNG?alt=media&token=8bf07686-f0ec-41e3-ab08-6a6fca246ce2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%90%D7%AA%D7%9E%D7%95%D7%9C.mp3?alt=media&token=93f4a3ae-b03d-494b-b406-263681fe7bd3", false, 0, true),
    //     new WordClass("", "היום", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%94%D7%99%D7%95%D7%9D.mp3?alt=media&token=d381aa27-eed2-4d9c-a6ce-502720e8034c", false, 0, true),
    //     new WordClass("", "מחר", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Fnext.PNG?alt=media&token=c5f2afab-f60f-4a45-adc8-681b490f5d59", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%9E%D7%97%D7%A8.mp3?alt=media&token=101f7451-b391-46a1-825b-dfae6823d28d", false, 0, true),
    //     new WordClass("", "שבוע שעבר", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2F%25E2%2580%258F%25E2%2580%258Fprev.PNG?alt=media&token=8bf07686-f0ec-41e3-ab08-6a6fca246ce2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%A9%D7%91%D7%95%D7%A2%20%D7%A9%D7%A2%D7%91%D7%A8.mp3?alt=media&token=8e6f32be-f234-4860-9e5f-c60691883296", false, 0, true),
    //     new WordClass("", "שבוע הבא", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Fimages%2Fnext.PNG?alt=media&token=c5f2afab-f60f-4a45-adc8-681b490f5d59", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%A9%D7%91%D7%95%D7%A2%20%D7%94%D7%91%D7%90.mp3?alt=media&token=5a8a98a3-cc2e-4929-b50a-5d85d00378f6", false, 0, true),
    //     new WordClass("", "בוקר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%91%D7%95%D7%A7%D7%A8.mp3?alt=media&token=285c2774-5bb7-4ed3-9fbb-89728883cecc", false, 0, true),
    //     new WordClass("", "צהריים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%A6%D7%94%D7%A8%D7%99%D7%99%D7%9D.mp3?alt=media&token=f4b96a54-a56f-44d1-a4d1-1afa3f447de9", false, 0, true),
    //     new WordClass("", "ערב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fdays%2Faudio%2F%D7%A2%D7%A8%D7%91.mp3?alt=media&token=f539edba-324b-4dfb-a6a7-2e1005f2ee6c", false, 0, true),
    //   ],

    //   [//NUMBERS
    //     new WordClass("", "1-אחד", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%90%D7%97%D7%93.mp3?alt=media&token=b84b9d66-0a6c-4d41-a43d-e6fdc91c19aa", false, 0, true),
    //     new WordClass("", "2-שתיים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%AA%D7%99%D7%99%D7%9D.mp3?alt=media&token=fc05f7c5-e475-4cf7-b627-fb608a494c84", false, 0, true),
    //     new WordClass("", "3-שלוש", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%9C%D7%95%D7%A9.mp3?alt=media&token=7278486b-cb7d-4723-a8ab-2d61f31abf1b", false, 0, true),
    //     new WordClass("", "4-ארבע", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%90%D7%A8%D7%91%D7%A2.mp3?alt=media&token=5b92f457-ac22-4dc4-b4e4-46c7e77e2457", false, 0, true),
    //     new WordClass("", "5-חמש", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%97%D7%9E%D7%A9.mp3?alt=media&token=64254bb5-24cf-4584-ab1f-c9ea5dc7701c", false, 0, true),
    //     new WordClass("", "6-שש", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%A9.mp3?alt=media&token=aab257a4-a38f-4718-8b27-ca9a9728e0b5", false, 0, true),
    //     new WordClass("", "7-שבע", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%91%D7%A2.mp3?alt=media&token=6cffd7da-1ac9-4209-a901-81133626755d", false, 0, true),
    //     new WordClass("", "8-שמונה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%9E%D7%95%D7%A0%D7%94.mp3?alt=media&token=24f6ae3d-3b0a-4268-b9a0-17ffbfd4d852", false, 0, true),
    //     new WordClass("", "9-תשע", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%AA%D7%A9%D7%A2.mp3?alt=media&token=f7c4c7ee-8f87-4868-8ab9-7c92d31d59fc", false, 0, true),
    //     new WordClass("", "10-עשר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A2%D7%A9%D7%A8.mp3?alt=media&token=3a6cb692-7994-489e-9ba2-5346594fdfea", false, 0, true),
    //     new WordClass("", "20-עשרים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A2%D7%A9%D7%A8%D7%99%D7%9D.mp3?alt=media&token=4e219dd9-b64a-4554-8243-c84604046da4", false, 0, true),
    //     new WordClass("", "30-שלושים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%9C%D7%95%D7%A9%D7%99%D7%9D.mp3?alt=media&token=1663ea59-1567-4ff9-8855-43e7a5c964aa", false, 0, true),
    //     new WordClass("", "40-ארבעים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%90%D7%A8%D7%91%D7%A2%D7%99%D7%9D.mp3?alt=media&token=fb1f0408-898f-47a5-8e2f-8bbe4ca7b517", false, 0, true),
    //     new WordClass("", "50-חמישים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%97%D7%9E%D7%99%D7%A9%D7%99%D7%9D.mp3?alt=media&token=3860ebbe-f157-44c8-85c7-00b8b813f4d3", false, 0, true),
    //     new WordClass("", "60-שישים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%99%D7%A9%D7%99%D7%9D.mp3?alt=media&token=32333fbc-3020-469c-adc9-0fc5cfa899b2", false, 0, true),
    //     new WordClass("", "70-שבעים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%91%D7%A2%D7%99%D7%9D.mp3?alt=media&token=e640d3ee-97f3-4048-bbb0-bb5dfd53b6ed", false, 0, true),
    //     new WordClass("", "80-שמונים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%A9%D7%9E%D7%95%D7%A0%D7%99%D7%9D.mp3?alt=media&token=2ebb6c0d-bd27-4772-afcd-9ca2cf22ada5", false, 0, true),
    //     new WordClass("", "90-תשעים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%AA%D7%A9%D7%A2%D7%99%D7%9D.mp3?alt=media&token=05b6a8a1-c316-496d-8c4b-0216bad1de4c", false, 0, true),
    //     new WordClass("", "100-מאה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fnumbers%2Faudio%2F%D7%9E%D7%90%D7%94.mp3?alt=media&token=20c02e54-f20c-492f-ae1a-d2e1b8ea64b7", false, 0, true),
    //   ],

    //   [
    //     new WordClass("", "תשרי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%AA%D7%A9%D7%A8%D7%99.mp3?alt=media&token=66e94ee7-ee50-495b-a28a-af706075bc04", false, 0, true),
    //     new WordClass("", "חשוון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%97%D7%A9%D7%95%D7%95%D7%9F.mp3?alt=media&token=48d0db20-40af-44e7-a02e-818051da4aaf", false, 0, true),
    //     new WordClass("", "כסליו", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%9B%D7%A1%D7%9C%D7%99%D7%95.mp3?alt=media&token=5a74e3c3-79d1-447e-b180-ab098cd8630b", false, 0, true),
    //     new WordClass("", "טבת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%98%D7%91%D7%AA.mp3?alt=media&token=bd23d9f6-b3af-4cff-a359-da70816a97b7", false, 0, true),
    //     new WordClass("", "שבט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%A9%D7%91%D7%98.mp3?alt=media&token=77d0cf74-fb96-4775-bc0e-3339cd9470c9", false, 0, true),
    //     new WordClass("", "אדר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%90%D7%93%D7%A8.mp3?alt=media&token=af57f82d-d90a-431f-bba8-9a284005373f", false, 0, true),
    //     new WordClass("", "ניסן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%A0%D7%99%D7%A1%D7%9F.mp3?alt=media&token=10ea5b59-7b59-48f5-9a10-4694edd8b5f2", false, 0, true),
    //     new WordClass("", "אייר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%90%D7%99%D7%99%D7%A8.mp3?alt=media&token=192f1f0c-ab16-4362-813f-22d45fd95bc4", false, 0, true),
    //     new WordClass("", "סיוון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%A1%D7%99%D7%95%D7%95%D7%9F.mp3?alt=media&token=bf5dae0c-4b10-44d1-9eac-0ee11689d8da", false, 0, true),
    //     new WordClass("", "תמוז", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%AA%D7%9E%D7%95%D7%96.mp3?alt=media&token=5a6b4cf8-bc6d-46dd-a2ce-4ca41cc2ff59", false, 0, true),
    //     new WordClass("", "אב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%90%D7%91.mp3?alt=media&token=8d7ce913-161b-47f8-94be-bef2fda7ac35", false, 0, true),
    //     new WordClass("", "אלול", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fhebrew%20months%2Faudio%2F%D7%90%D7%9C%D7%95%D7%9C.mp3?alt=media&token=6ad41146-e452-4a9f-8326-aca5c43f98ec", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "ינואר - 1", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%99%D7%A0%D7%95%D7%90%D7%A8.mp3?alt=media&token=8d993b7e-10e6-42ce-a6f5-98ef1a0b3bd8", false, 0, true),
    //     new WordClass("", "פברואר - 2", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%A4%D7%91%D7%A8%D7%95%D7%90%D7%A8.mp3?alt=media&token=dd89d6d1-51c9-44cb-b56b-4d32de429ab6", false, 0, true),
    //     new WordClass("", "מרץ - 3", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%9E%D7%A8%D7%A5.mp3?alt=media&token=9c14eddd-44d6-45d7-89fc-2f54f282535b", false, 0, true),
    //     new WordClass("", "אפריל - 4", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%90%D7%A4%D7%A8%D7%99%D7%9C.mp3?alt=media&token=4a8be03a-6901-42b7-be65-5297da8f295a", false, 0, true),
    //     new WordClass("", "מאי - 5", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%9E%D7%90%D7%99.mp3?alt=media&token=0ad7dcde-3c3f-4c89-b836-5e16303a78bf", false, 0, true),
    //     new WordClass("", "יוני - 6", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%99%D7%95%D7%A0%D7%99.mp3?alt=media&token=e25ef576-1716-4fcd-ba64-af36641e55cd", false, 0, true),
    //     new WordClass("", "יולי - 7", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%99%D7%95%D7%9C%D7%99.mp3?alt=media&token=21b6acc5-6717-4bb3-9a70-d7e67d2fe1d0", false, 0, true),
    //     new WordClass("", "אוגוסט - 8", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%90%D7%95%D7%92%D7%95%D7%A1%D7%98.mp3?alt=media&token=47ca7e4e-14d4-4650-a2cc-8061e934c476", false, 0, true),
    //     new WordClass("", "ספטמבר - 9", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%A1%D7%A4%D7%98%D7%9E%D7%91%D7%A8.mp3?alt=media&token=88895f88-d3a2-4277-b44b-42f6058b4e86", false, 0, true),
    //     new WordClass("", "אוקטובר - 10", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%90%D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8.mp3?alt=media&token=01ac1a0b-fe4b-47b8-8b1e-6f6f7426663f", false, 0, true),
    //     new WordClass("", "נובמבר - 11", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%A0%D7%95%D7%91%D7%9E%D7%91%D7%A8.mp3?alt=media&token=84e06613-4389-4bf6-9b35-cdd612eb7e9c", false, 0, true),
    //     new WordClass("", "דצמבר - 12", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fmonths%2Faudio%2F%D7%93%D7%A6%D7%9E%D7%91%D7%A8.mp3?alt=media&token=405fd571-92d5-490d-b90a-b11c56894d41", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "ראש השנה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A8%D7%90%D7%A9%20%D7%94%D7%A9%D7%A0%D7%94.mp3?alt=media&token=88320b2a-d712-4bf6-b792-d1a7f2f58518", false, 0, true),
    //     new WordClass("", "יום כיפור", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%9B%D7%99%D7%A4%D7%95%D7%A8.mp3?alt=media&token=d55e11e3-4bcd-43d4-994e-7ee0401ae81a", false, 0, true),
    //     new WordClass("", "סוכות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A1%D7%95%D7%9B%D7%95%D7%AA.mp3?alt=media&token=27b993d8-47e0-407e-a927-1efe4e83ba21", false, 0, true),
    //     new WordClass("", "שמחת תורה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A9%D7%9E%D7%97%D7%AA%20%D7%AA%D7%95%D7%A8%D7%94.mp3?alt=media&token=8b6c3fdb-b5a4-48d6-bc87-123415f47afd", false, 0, true),
    //     new WordClass("", "חנוכה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%97%D7%A0%D7%95%D7%9B%D7%94.mp3?alt=media&token=b17604ce-43f2-4fc9-bdde-d9ab1c0ecb0f", false, 0, true),
    //     new WordClass("", "טו בשבט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%98%D7%95%20%D7%91%D7%A9%D7%91%D7%98.mp3?alt=media&token=4b88b8f2-f341-4b48-a563-bfead348aebd", false, 0, true),
    //     new WordClass("", "פורים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%95%D7%A8%D7%99%D7%9D.mp3?alt=media&token=efab9a69-4211-40d3-a415-e8ead0322d6c", false, 0, true),
    //     new WordClass("", "פסח", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%A1%D7%97.mp3?alt=media&token=b355ba49-e050-4f14-a8c3-4127cda3ecaa", false, 0, true),
    //     new WordClass("", "יום השואה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%A9%D7%95%D7%90%D7%94.mp3?alt=media&token=d4eff088-a7d2-4773-8536-de55c9ddb1ae", false, 0, true),
    //     new WordClass("", "יום הזיכרון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%96%D7%99%D7%9B%D7%A8%D7%95%D7%9F.mp3?alt=media&token=6c6a4d68-717c-4f75-ade6-f6fbaf73b50a", false, 0, true),
    //     new WordClass("", "יום העצמאות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%A2%D7%A6%D7%9E%D7%90%D7%95%D7%AA.mp3?alt=media&token=b0b13122-79f9-46f6-8efc-3fc57f680897", false, 0, true),
    //     new WordClass("", "לג בעומר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%9C%D7%92%20%D7%91%D7%A2%D7%95%D7%9E%D7%A8.mp3?alt=media&token=209b1d4b-abf6-4fb5-b3e3-54c4099d3eba", false, 0, true),
    //     new WordClass("", "שבועות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%A9%D7%91%D7%95%D7%A2%D7%95%D7%AA.mp3?alt=media&token=6088a921-46d2-42b9-9084-42d95b71ff3c", false, 0, true),
    //     new WordClass("", "תשעה באב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2F%D7%97%D7%92%D7%99%D7%9D%2Faudio%2F%D7%AA%D7%A9%D7%A2%D7%94%20%D7%91%D7%90%D7%91.mp3?alt=media&token=55f6732d-4af1-43f5-b081-c63039875ed8", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "יום הולדת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%94%D7%95%D7%9C%D7%93%D7%AA.mp3?alt=media&token=053becc3-06a4-413c-b70d-71056c794d89", false, 0, true),
    //     new WordClass("", "מסיבה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%9E%D7%A1%D7%99%D7%91%D7%94.mp3?alt=media&token=8df1ee8e-035d-4ee5-84b1-b4679c1c7411", false, 0, true),
    //     new WordClass("", "אירוסין", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%90%D7%99%D7%A8%D7%95%D7%A1%D7%99%D7%9F.mp3?alt=media&token=af54e688-95e0-4929-be0e-ea6fe77fae4c", false, 0, true),
    //     new WordClass("", "חתונה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%97%D7%AA%D7%95%D7%A0%D7%94.mp3?alt=media&token=601b0133-761f-4bfc-b534-c1b687dcc96f", false, 0, true),
    //     new WordClass("", "יום נישואין", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%99%D7%95%D7%9D%20%D7%A0%D7%99%D7%A9%D7%95%D7%90%D7%99%D7%9F.mp3?alt=media&token=c903d077-227d-4906-a67d-a595178d8723", false, 0, true),
    //     new WordClass("", "גירושין", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F.mp3?alt=media&token=d1567413-d8f0-4c46-9ae3-aa8c4f83c9d0", false, 0, true),
    //     new WordClass("", "בר מצווה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%91%D7%A8%20%D7%9E%D7%A6%D7%95%D7%95%D7%94.mp3?alt=media&token=dbdb01e2-1b38-4df6-982f-d40ed9e6468b", false, 0, true),
    //     new WordClass("", "בת מצווה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%91%D7%AA%20%D7%9E%D7%A6%D7%95%D7%95%D7%94.mp3?alt=media&token=09f80923-f9f6-4861-8b0c-686ecde2e0aa", false, 0, true),
    //     new WordClass("", "ברית", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%91%D7%A8%D7%99%D7%AA.mp3?alt=media&token=00946d92-cc0d-4f65-b335-0e40d4cf9047", false, 0, true),
    //     new WordClass("", "זבד הבת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%96%D7%91%D7%93%20%D7%94%D7%91%D7%AA.mp3?alt=media&token=fffd111d-1c31-45ac-9621-29f338ac2560", false, 0, true),
    //     new WordClass("", "הלוויה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%94%D7%9C%D7%95%D7%95%D7%99%D7%94.mp3?alt=media&token=7c7832e9-e15e-4a07-8b9d-c0a9e4383e6f", false, 0, true),
    //     new WordClass("", "אזכרה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%90%D7%96%D7%9B%D7%A8%D7%94.mp3?alt=media&token=74240be0-48c4-417c-8ed9-f43df8be7c1c", false, 0, true),
    //     new WordClass("", "שבעה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%A9%D7%91%D7%A2%D7%94.mp3?alt=media&token=e8f4384a-347a-4816-bb06-52d686d15a13", false, 0, true),
    //     new WordClass("", "גיוס לצבא", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%92%D7%99%D7%95%D7%A1%20%D7%9C%D7%A6%D7%91%D7%90.mp3?alt=media&token=85bc6bc7-6264-4771-9018-fa5953df31c0", false, 0, true),
    //     new WordClass("", "טקס סיום", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftime%2Fevents%2Faudio%2F%D7%98%D7%A7%D7%A1%20%D7%A1%D7%99%D7%95%D7%9D.mp3?alt=media&token=3a52dffe-57af-44e5-be4b-b39570572743", false, 0, true)
    //   ]

    // ];
    // this.add_new_cat_to_db(cat, words, subCats, subPhrases, false);

    //PLACES CATEGORY  
    // cat = new CategoryClass("מקומות", "", "https://firebasestorage.googleapis.com/v0/b/auth-development-599b0.appspot.com/o/places.png?alt=media&token=97113d17-28ab-43b0-beb6-bbb43c3792a0", this.userEmail, "", 0, false, 2, true)
    // words = [];
    // subCats = [
    //   new CategoryClass("בילויים", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("מקומות שאני הולך אליהם", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("חדרים בבית", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("בנק", "", "", this.userEmail, "", 0, false, 1, true),
    //   new CategoryClass("קניות", "", "", this.userEmail, "", 0, false, 2, true),
    //   new CategoryClass("מסעדות ובתי קפה", "", "", this.userEmail, "", 0, false, 3, true)
    // ]

    // subPhrases = [
    //   [
    //     new WordClass("", "קונצרט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A7%D7%95%D7%A0%D7%A6%D7%A8%D7%98.mp3?alt=media&token=580fa79b-17df-4501-b503-15286403b0f7", false, 0, true),
    //     new WordClass("", "מוזיאון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%9E%D7%95%D7%96%D7%99%D7%90%D7%95%D7%9F.mp3?alt=media&token=7f1200fa-118f-416b-a29c-cd02f7a8d50a", false, 0, true),
    //     new WordClass("", "תיאטרון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%AA%D7%99%D7%90%D7%98%D7%A8%D7%95%D7%9F.mp3?alt=media&token=ea3e9124-63e5-459b-987f-1ce075705c8b", false, 0, true),
    //     new WordClass("", "הופעה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%94%D7%95%D7%A4%D7%A2%D7%94.mp3?alt=media&token=dabc01a8-2cb2-47f0-a17a-2e00541e1667", false, 0, true),
    //     new WordClass("", "קןלנוע", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A7%D7%95%D7%9C%D7%A0%D7%95%D7%A2.mp3?alt=media&token=4b8dd6de-172b-4bb8-b526-234c3fd746f0", false, 0, true),
    //     new WordClass("", "מסעדה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%9E%D7%A1%D7%A2%D7%93%D7%94.mp3?alt=media&token=a7af46a2-8a29-4b7f-a4f6-7c411037bf5e", false, 0, true),
    //     new WordClass("", "טיול", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%98%D7%99%D7%95%D7%9C.mp3?alt=media&token=6a907618-3979-459b-a62f-6882358da7ab", false, 0, true),
    //     new WordClass("", 'חו"ל', "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%97%D7%95%D7%9C.mp3?alt=media&token=e5bb056e-9a5c-4633-9589-528984b38fa9", false, 0, true),
    //     new WordClass("", "קניות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A7%D7%A0%D7%99%D7%95%D7%AA.mp3?alt=media&token=16b8e15e-b0de-4063-9cb0-3001d2352c62", false, 0, true),
    //     new WordClass("", "פיקניק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%99%D7%A7%D7%A0%D7%99%D7%A7.mp3?alt=media&token=b9e2ea0d-2fd6-4ab5-8702-c3c7ba1cee41", false, 0, true),
    //     new WordClass("", "פארק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%A4%D7%90%D7%A8%D7%A7.mp3?alt=media&token=01e85dc0-43ad-49c6-88c3-90b96b11ca8f", false, 0, true),
    //     new WordClass("", "ים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2F%D7%91%D7%99%D7%9C%D7%95%D7%99%D7%99%D7%9D%2Faudio%2F%D7%99%D7%9D.mp3?alt=media&token=55746758-5e22-403e-992d-240c4fb09218", false, 0, true)
    //   ],
    //   [
    //     new WordClass("", "דואר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%93%D7%95%D7%90%D7%A8.mp3?alt=media&token=9efaecf4-02a9-44f8-a746-18e91e0d5569", false, 0, true),
    //     new WordClass("", "סופרמרקט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%A1%D7%95%D7%A4%D7%A8%D7%9E%D7%A8%D7%A7%D7%98.mp3?alt=media&token=d33f2ba1-ce0e-4ddf-984d-b2124b2a2ae2", false, 0, true),
    //     new WordClass("", "בית חולים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%99%D7%AA%20%D7%97%D7%95%D7%9C%D7%99%D7%9D.mp3?alt=media&token=3d808039-f3bf-4731-92ba-d718415390cd", false, 0, true),
    //     new WordClass("", "קופת חולים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%A7%D7%95%D7%A4%D7%AA%20%D7%97%D7%95%D7%9C%D7%99%D7%9D.mp3?alt=media&token=a294c3c1-b0b0-4bc5-8fe2-3df2cf8c57f3", false, 0, true),
    //     new WordClass("", "קניון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%A7%D7%A0%D7%99%D7%95%D7%9F.mp3?alt=media&token=f84b9a89-4235-438c-8fc5-ade0542055e5", false, 0, true),
    //     new WordClass("", "בית כנסת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%99%D7%AA%20%D7%9B%D7%A0%D7%A1%D7%AA.mp3?alt=media&token=a25fb311-3ea0-43e8-a64b-38e18fc027ba", false, 0, true),
    //     new WordClass("", "חנות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%97%D7%A0%D7%95%D7%AA.mp3?alt=media&token=3cd04258-7564-4cd6-82ba-860e0a794e7f", false, 0, true),
    //     new WordClass("", "בית מלון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%99%D7%AA%20%D7%9E%D7%9C%D7%95%D7%9F.mp3?alt=media&token=9f072739-d1c1-4047-8fed-e119f4d438f3", false, 0, true),
    //     new WordClass("", "מספרה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%9E%D7%A1%D7%A4%D7%A8%D7%94.mp3?alt=media&token=48faf48b-4b48-4c0d-ad3c-04aa8d1b8002", false, 0, true),
    //     new WordClass("", "מוסך", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%9E%D7%95%D7%A1%D7%9A.mp3?alt=media&token=4a4f81fc-bf12-4517-8de0-4ff9506423a0", false, 0, true),
    //     new WordClass("", "חדר כושר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%97%D7%93%D7%A8%20%D7%9B%D7%95%D7%A9%D7%A8.mp3?alt=media&token=44b01dd3-ff01-4a5d-97a9-71f1481f3ef2", false, 0, true),
    //     new WordClass("", "בריכה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%A8%D7%99%D7%9B%D7%94.mp3?alt=media&token=4588c5a9-b51e-430b-a76c-e0d3e43ba7eb", false, 0, true),
    //     new WordClass("", "בנק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fplaces%20I%20go%2Faudio%2F%D7%91%D7%A0%D7%A7.mp3?alt=media&token=b4be1fa7-376e-4b97-bb8b-2331e8a0ac32", false, 0, true)
    //   ],
    //   [
    //     new WordClass("", "סלון", "", "", 0, "", false, 0, true),
    //     new WordClass("", "מטבח", "", "", 0, "", false, 0, true),
    //     new WordClass("", "שירותים", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אמבטיה", "", "", 0, "", false, 0, true),
    //     new WordClass("", "חדר שינה", "", "", 0, "", false, 0, true),
    //     new WordClass("", "חדר ילדים", "", "", 0, "", false, 0, true),
    //     new WordClass("", "גינה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Froom%20at%20home%2Faudio%2F%D7%92%D7%99%D7%A0%D7%94.mp3?alt=media&token=79f9a8f2-9e01-4b02-af54-f4f0681bec9e", false, 0, true),
    //     new WordClass("", "מרפסת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Froom%20at%20home%2Faudio%2F%D7%9E%D7%A8%D7%A4%D7%A1%D7%AA.mp3?alt=media&token=8d27532c-7fbe-4235-b681-35c05645788f", false, 0, true),
    //     new WordClass("", "מחסן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Froom%20at%20home%2Faudio%2F%D7%9E%D7%97%D7%A1%D7%9F.mp3?alt=media&token=d4240582-5752-491c-a6c3-a8ec9a0ba933", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "היכן הכספומט הקרוב?", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אני רוצה למשוך כסף מהחשבון", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אני רוצה להפקיד כסף בחשבון", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אני רוצה לפתוח חשבון בנק", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אני רוצה לקבל שירות מבנקאי/ת", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אני לא זוכר את המספר חשבון שלי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fbank%2Faudio%2F%D7%90%D7%A0%D7%99%20%D7%9C%D7%90%20%D7%96%D7%95%D7%9B%D7%A8%20%D7%90%D7%AA%20%D7%9E%D7%A1%D7%A4%D7%A8%20%D7%94%D7%97%D7%A9%D7%91%D7%95%D7%9F%20%D7%A9%D7%9C%D7%99.mp3?alt=media&token=b00bd6f9-5d4a-4a29-b60a-7cd2410c1949", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "אפשר למדוד?", "", "", 0, "", false, 0, true),
    //     new WordClass("", "היכן תאי המדידה?", "", "", 0, "", false, 0, true),
    //     new WordClass("", "כמה זה עולה?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fshopping%2Faudio%2F%D7%9B%D7%9E%D7%94%20%D7%96%D7%94%20%D7%A2%D7%95%D7%9C%D7%94.mp3?alt=media&token=9c82f603-e688-4783-9df7-3d6cb85de84b", false, 0, true),
    //     new WordClass("", "אפשר לשלם?", "", "", 0, "", false, 0, true),
    //     new WordClass("", "יש מידה אחרת?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fshopping%2Faudio%2F%D7%99%D7%A9%20%D7%9E%D7%99%D7%93%D7%94%20%D7%90%D7%97%D7%A8%D7%AA.mp3?alt=media&token=7ccde529-8c13-4161-8940-e177d3e2ee2e", false, 0, true),
    //     new WordClass("", "יש בצבע אחר?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fplaces%2Fshopping%2Faudio%2F%D7%99%D7%A9%20%D7%91%D7%A6%D7%91%D7%A2%20%D7%90%D7%97%D7%A8.mp3?alt=media&token=2a0c0eee-fc20-4f3a-b9d4-755005f19ced", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "אפשר תפריט בבקשה", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אפשר להזמין בבקשה", "", "", 0, "", false, 0, true),
    //     new WordClass("", "מה מומלץ להזמין?", "", "", 0, "", false, 0, true),
    //     new WordClass("", "אפשר להזמין חשבון בבקשה?", "", "", 0, "", false, 0, true),
    //     new WordClass("", "טעים מאוד", "", "", 0, "", false, 0, true),
    //     new WordClass("", "לא טעים לי", "", "", 0, "", false, 0, true)
    //   ]
    // ];

    // this.add_new_cat_to_db(cat, words, subCats, subPhrases, false);

    //Travel
    // cat = new CategoryClass("נסיעות", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fdestination.PNG?alt=media&token=1f05a094-877e-4a30-aeb4-0ea685cadc53", this.userEmail, "", 0, false, 5, true)

    // words = [
    //   new WordClass("", "כיצד מגיעים ליעד?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fdestination.PNG?alt=media&token=1f05a094-877e-4a30-aeb4-0ea685cadc53", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2F%D7%9B%D7%99%D7%A6%D7%93%20%D7%9E%D7%92%D7%99%D7%A2%D7%99%D7%9D%20%D7%9C%D7%99%D7%A2%D7%93%20(1).mp3?alt=media&token=8d7ecba2-2ae6-4488-b8d4-682e39a67529", false, 0, true),
    //   new WordClass("", "כמה עולה הנסיעה?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fcost.PNG?alt=media&token=b4642c22-c838-45f1-8409-4f66ada76da3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2F%D7%9B%D7%9E%D7%94%20%D7%A2%D7%95%D7%9C%D7%94%20%D7%94%D7%A0%D7%A1%D7%99%D7%A2%D7%94.mp3?alt=media&token=ca91ee5d-d667-4760-a8d4-37e90044771e", false, 0, true),
    // ];

    // subCats = [
    //   new CategoryClass("רכב פרטי", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("אוטובוס", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fbus.PNG?alt=media&token=1e184ef9-452f-4f5d-a322-761bfbebfdb6", this.userEmail, "", 0, false, 1, true),
    //   new CategoryClass("רכבת", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Ftrain.PNG?alt=media&token=42334b08-0b56-4ca7-9f42-c49bce05f7a5", this.userEmail, "", 0, false, 2, true),
    //   new CategoryClass("מונית", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Ftaxi.PNG?alt=media&token=86c816d9-24b2-49e2-a559-7a4b8c58215a", this.userEmail, "", 0, false, 3, true),
    // ]

    // subPhrases = [
    //   [
    //     new WordClass("", "היכן תחנת הדלק הקרובה?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fcar%2F%D7%94%D7%99%D7%9B%D7%9F%20%D7%AA%D7%97%D7%A0%D7%AA%20%D7%94%D7%93%D7%9C%D7%A7%20%D7%94%D7%A7%D7%A8%D7%95%D7%91%D7%94.mp3?alt=media&token=b173e0e2-2014-4ba2-96c3-f1672c7b762b", false, 0, true),
    //     new WordClass("", "צריך טרמפ?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fcar%2F%D7%A6%D7%A8%D7%99%D7%9A%20%D7%98%D7%A8%D7%9E%D7%A4.mp3?alt=media&token=e986a3ad-ca87-4e91-a5cc-8ae51dcf5876", false, 0, true),
    //     new WordClass("", "צריכה טרמפ?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fcar%2F%D7%A6%D7%A8%D7%99%D7%9B%D7%94%20%D7%98%D7%A8%D7%9E%D7%A4.mp3?alt=media&token=56688c2a-dd95-49b5-89ea-f811462f1755", false, 0, true),
    //     new WordClass("", "היכן המוסך הקרוב?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fcar%2F%D7%94%D7%99%D7%9B%D7%9F%20%D7%94%D7%9E%D7%95%D7%A1%D7%9A%20%D7%94%D7%A7%D7%A8%D7%95%D7%91.mp3?alt=media&token=c16906e2-5202-4bac-9eca-22e014344d9d", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "היכן תחנת האוטובוס?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fbus-station.PNG?alt=media&token=c26b6f69-a184-427b-8e04-a9d369796380", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fbus%2F%D7%94%D7%99%D7%9B%D7%9F%20%D7%AA%D7%97%D7%A0%D7%AA%20%D7%94%D7%90%D7%95%D7%98%D7%95%D7%91%D7%95%D7%A1.mp3?alt=media&token=afc457cd-015e-4832-9d86-3906d882f43e", false, 0, true),
    //     new WordClass("", "מתי האוטובוס הבא יגיע?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fclock.PNG?alt=media&token=2f3ed60a-5e35-4fd6-ae51-053e0568942b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fbus%2F%D7%9E%D7%AA%D7%99%20%D7%94%D7%90%D7%95%D7%98%D7%95%D7%91%D7%A1%20%D7%94%D7%91%D7%90%20%D7%99%D7%92%D7%99%D7%A2.mp3?alt=media&token=da3a99b3-2e58-4324-adb7-92b636d4e5df", false, 0, true),
    //     new WordClass("", "באיזו תחנה לרדת?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fbus-station.PNG?alt=media&token=c26b6f69-a184-427b-8e04-a9d369796380", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Fbus%2F%D7%91%D7%90%D7%99%D7%96%D7%95%20%D7%AA%D7%97%D7%A0%D7%94%20%D7%9C%D7%A8%D7%93%D7%AA.mp3?alt=media&token=43b22d66-e214-4d87-848d-12496ebb48f9", false, 0, true),
    //   ],

    //   [
    //     new WordClass("", "היכן תחנת הרכבת?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Ftrain.PNG?alt=media&token=42334b08-0b56-4ca7-9f42-c49bce05f7a5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftrain%2F%D7%94%D7%99%D7%9B%D7%9F%20%D7%AA%D7%97%D7%A0%D7%AA%20%D7%94%D7%A8%D7%9B%D7%91%D7%AA.mp3?alt=media&token=ced9a44a-15e9-457c-aa7a-002fb58ecec1", false, 0, true),
    //     new WordClass("", "מתי הרכבת הבאה תגיע?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fclock.PNG?alt=media&token=2f3ed60a-5e35-4fd6-ae51-053e0568942b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftrain%2F%D7%9E%D7%AA%D7%99%20%D7%94%D7%A8%D7%9B%D7%91%D7%AA%20%D7%94%D7%91%D7%90%D7%94%20%D7%AA%D7%92%D7%99%D7%A2.mp3?alt=media&token=39a90661-2f75-4cea-93fe-bcd0420546db", false, 0, true),
    //     new WordClass("", "באיזו תחנה לרדת?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Ftrain_station.PNG?alt=media&token=7283ec4e-a88a-4055-a4f6-9101104d66fd", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftrain%2F%D7%91%D7%90%D7%99%D7%96%D7%95%25%D7%AA%D7%97%D7%A0%D7%94%25%D7%9C%D7%A8%D7%93%D7%AA.mp3?alt=media&token=e10b67b2-5362-4dd4-8aed-0fe120255e88", false, 0, true)
    //   ],

    //   [
    //     new WordClass("", "אני רוצה להזמין מונית", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Ftaxi.PNG?alt=media&token=86c816d9-24b2-49e2-a559-7a4b8c58215a", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftaxi%2F%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%9E%D7%95%D7%A0%D7%99%D7%AA.mp3?alt=media&token=fb240efc-9a06-4836-ae2a-bd1b1081d462", false, 0, true),
    //     new WordClass("", "אתה יכול להפעיל מונה?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fcost.PNG?alt=media&token=b4642c22-c838-45f1-8409-4f66ada76da3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftaxi%2F%D7%90%D7%AA%D7%94%20%D7%99%D7%9B%D7%95%D7%9C%20%D7%9C%D7%94%D7%A4%D7%A2%D7%99%D7%9C%20%D7%9E%D7%95%D7%A0%D7%94.mp3?alt=media&token=9a4e6009-c811-446b-8b7b-9b1d008e074c", false, 0, true),
    //     new WordClass("", "אצטרך עצירה נוספת", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fdestination.PNG?alt=media&token=1f05a094-877e-4a30-aeb4-0ea685cadc53", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftaxi%2F%D7%90%D7%A6%D7%98%D7%A8%D7%9A%20%D7%A2%D7%A6%D7%99%D7%A8%D7%94%20%D7%A0%D7%95%D7%A1%D7%A4%D7%AA.mp3?alt=media&token=17dba32c-f268-46a2-a204-fd6cbc25e810", false, 0, true),
    //     new WordClass("", "אני צריך להגיע ל....", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fdestination.PNG?alt=media&token=1f05a094-877e-4a30-aeb4-0ea685cadc53", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftaxi%2F%D7%90%D7%A0%D7%99%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%9C%D7%94%D7%92%D7%99%D7%A2%20%D7%9C.mp3?alt=media&token=93084297-0f76-4541-8217-81158647698a", false, 0, true), new WordClass("", "", "", "", 0, "", false, 0, true),
    //     new WordClass("", "כמה אני צריך לשלם?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fcost.PNG?alt=media&token=b4642c22-c838-45f1-8409-4f66ada76da3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftaxi%2F%D7%9B%D7%9E%D7%94%20%D7%90%D7%A0%D7%99%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%9C%D7%A9%D7%9C%D7%9D.mp3?alt=media&token=40fb1df9-cc9e-4bbd-9dd2-f7c9dd6a4910", false, 0, true),
    //     new WordClass("", "אתה מקבל כרטיס אשראי?", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Fimages%2Fcost.PNG?alt=media&token=b4642c22-c838-45f1-8409-4f66ada76da3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ftravel%2Faudio%2Ftaxi%2F%D7%90%D7%AA%D7%94%20%D7%9E%D7%A7%D7%91%D7%9C%20%D7%9B%D7%A8%D7%98%D7%99%D7%A1%20%D7%90%D7%A9%D7%A8%D7%90%D7%99.mp3?alt=media&token=52e750f2-4146-4a32-8b3a-861a414e5aeb", false, 0, true),
    //   ],
    // ];

    // this.add_new_cat_to_db(cat, words, subCats, subPhrases, false);


    //FOOD CATEGORY
    // cat = new CategoryClass("אוכל", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Fimages%2Ffood.PNG?alt=media&token=783e6cf9-688f-4a9c-afc4-4b5daec31023", this.userEmail, "", 0, false, 2, true)

    // words = [
    //   new WordClass("", "אני רוצה לאכול", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%90%D7%9B%D7%95%D7%9C.mp3?alt=media&token=e3ed315a-4b88-4ba2-a061-b000b969f56c", false, 0, true),
    //   new WordClass("", "אני לא רעב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A0%D7%99%20%D7%9C%D7%90%20%D7%A8%D7%A2%D7%91.mp3?alt=media&token=784c2d03-6e64-4003-bc6f-4f1042826db5", false, 0, true),
    //   new WordClass("", "להכין לך אוכל?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9C%D7%94%D7%9B%D7%99%D7%9F%20%D7%9C%D7%9A%20%D7%90%D7%95%D7%9B%D7%9C.mp3?alt=media&token=73208b35-6602-4b0e-97fd-dfc1d793db55", false, 0, true),
    //   new WordClass("", "סיימתי לאכול", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A1%D7%99%D7%99%D7%9E%D7%AA%D7%99%20%D7%9C%D7%90%D7%9B%D7%95%D7%9C.mp3?alt=media&token=125872fd-4c32-4a4c-846c-b3aec684764a", false, 0, true),
    //   new WordClass("", "אולי נצא לאכול בחוץ?", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%95%D7%9C%D7%99%20%D7%A0%D7%A6%D7%90%20%D7%9C%D7%90%D7%9B%D7%95%D7%9C%20%D7%91%D7%97%D7%95%D7%A5.mp3?alt=media&token=da836ee8-dabc-41e2-b6d4-18102052f81b", false, 0, true),
    // ];

    // subCats = [
    //   new CategoryClass("ארוחות", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("מוצרי חלב", "", "", this.userEmail, "", 0, false, 1, true),
    //   new CategoryClass("מוצרי בשר", "", "", this.userEmail, "", 0, false, 2, true),
    //   new CategoryClass("מאכלים כללים", "", "", this.userEmail, "", 0, false, 3, true),
    //   new CategoryClass("מאפים", "", "", this.userEmail, "", 0, false, 4, true),
    //   new CategoryClass("קינוחים", "", "", this.userEmail, "", 0, false, 5, true),
    //   new CategoryClass("משקאות", "", "", this.userEmail, "", 0, false, 6, true),
    //   new CategoryClass("ירקות", "", "", this.userEmail, "", 0, false, 7, true),
    //   new CategoryClass("פירות", "", "", this.userEmail, "", 0, false, 8, true),
    //   new CategoryClass("רטבים, ממרחים ותבלינים", "", "", this.userEmail, "", 0, false, 9, true),
    // ]

    // subPhrases = [
    //   [//ארוחות
    //     new WordClass("", "ארוחת בוקר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A8%D7%95%D7%97%D7%95%D7%AA%2F%D7%90%D7%A8%D7%95%D7%97%D7%AA%20%D7%91%D7%95%D7%A7%D7%A8.mp3?alt=media&token=8eba1263-9a1e-4d13-9bf1-8bf6511159d8", false, 0, true),
    //     new WordClass("", "ארוחת צהרים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A8%D7%95%D7%97%D7%95%D7%AA%2F%D7%90%D7%A8%D7%95%D7%97%D7%AA%20%D7%A6%D7%94%D7%A8%D7%99%D7%9D.mp3?alt=media&token=2f3c9c52-b61b-4220-b5e7-f89fa7a6a2b8", false, 0, true),
    //     new WordClass("", "ארוחת ערב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A8%D7%95%D7%97%D7%95%D7%AA%2F%D7%90%D7%A8%D7%95%D7%97%D7%AA%20%D7%A2%D7%A8%D7%91.mp3?alt=media&token=6eeafab1-a68e-4481-85d9-77ba59c58e51", false, 0, true),
    //     new WordClass("", "שתיה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A8%D7%95%D7%97%D7%95%D7%AA%2F%D7%A9%D7%AA%D7%99%D7%94.mp3?alt=media&token=0f9bd78c-a2ca-40d7-b17e-c1be127344db", false, 0, true),
    //     new WordClass("", "נשנוש", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%90%D7%A8%D7%95%D7%97%D7%95%D7%AA%2F%D7%A0%D7%A9%D7%A0%D7%95%D7%A9.mp3?alt=media&token=a74a7d2e-3291-4ee8-b905-36a83776efa7", false, 0, true),
    //   ],

    //   [//מוצרי חלב
    //      new WordClass("", "חלב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%97%D7%9C%D7%91.mp3?alt=media&token=02cbe1ca-503b-402f-9a31-f3156f8985f2", false, 0, true),
    //      new WordClass("", "גבינה לבנה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%92%D7%91%D7%99%D7%A0%D7%94%20%D7%9C%D7%91%D7%A0%D7%94.mp3?alt=media&token=efc5e008-0ba3-4379-b8e7-f31749ccd03d", false, 0, true),
    //      new WordClass("", "יוגורט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%99%D7%95%D7%92%D7%95%D7%A8%D7%98.mp3?alt=media&token=b99d6f8a-6f51-4199-a4dc-ba316e8c7fa9", false, 0, true),
    //      new WordClass("", "גבינה צהובה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%92%D7%91%D7%99%D7%A0%D7%94%20%D7%A6%D7%94%D7%95%D7%91%D7%94.mp3?alt=media&token=df1f7ef5-a09c-450d-bd64-9f2d4d75cee7", false, 0, true),
    //     // new WordClass("", "גבינה בולגרית", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%92%D7%91%D7%99%D7%A0%D7%94%20%D7%91%D7%95%D7%9C%D7%92%D7%A8%D7%99%D7%AA.mp3?alt=media&token=b46347b1-f9c6-4a87-b094-9eb5d6c11cb5", false, 0, true),
    //      new WordClass("", "קוטג'", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%A7%D7%95%D7%98%D7%92'.mp3?alt=media&token=c1dbbe70-ccf5-4a40-9b19-f36424132708", false, 0, true),
    //      new WordClass("", "ביצים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%91%D7%99%D7%A6%D7%99%D7%9D.mp3?alt=media&token=d3c967c4-e573-48ea-894d-9278a550bc6a", false, 0, true),
    //      new WordClass("", "חמאה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%97%D7%9E%D7%90%D7%94.mp3?alt=media&token=ecde95f3-d486-43fd-badc-95979ae252cc", false, 0, true),
    //      new WordClass("", "מעדן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%97%D7%9C%D7%91%2F%D7%9E%D7%A2%D7%93%D7%9F.mp3?alt=media&token=c10b0cc0-fe24-4044-91d4-9b96804dfbcb", false, 0, true),
    //   ],

    //   [//מוצרי בשר
    //     new WordClass("", "בשר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%91%D7%A9%D7%A8.mp3?alt=media&token=d83b5880-aba7-47e6-8c4c-5e3b0e9f40f5", false, 0, true),
    //     // new WordClass("", "סטייק אנטריקוט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A1%D7%98%D7%99%D7%99%D7%A7%20%D7%90%D7%A0%D7%98%D7%A8%D7%99%D7%A7%D7%95%D7%98.mp3?alt=media&token=0bab3f5c-9b1b-4769-9578-3f4ac8e7ba21", false, 0, true),
    //      new WordClass("", "קציצות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A7%D7%A6%D7%99%D7%A6%D7%95%D7%AA.mp3?alt=media&token=914e4f1d-af43-4fd7-a3e2-2f55f222c6f5", false, 0, true),
    //      new WordClass("", "עוף", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A2%D7%95%D7%A3.mp3?alt=media&token=bcb8e1cd-05f6-4e19-8661-0fd3b9420900", false, 0, true),
    //     // new WordClass("", "שניצל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A9%D7%A0%D7%99%D7%A6%D7%9C.mp3?alt=media&token=8279874d-67eb-47bf-9ada-329ebb9b59f7", false, 0, true),
    //     // new WordClass("", "כדורי בשר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%9B%D7%93%D7%95%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8.mp3?alt=media&token=cc609f6c-03ca-40b3-ab8c-96ec1f29820d", false, 0, true),
    //     // new WordClass("", "חזה עוף", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%97%D7%96%D7%94%20%D7%A2%D7%95%D7%A3.mp3?alt=media&token=5b2f202f-6bb9-4269-945f-42f199f9c6bf", false, 0, true),
    //     // new WordClass("", "שווארמה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%A9%D7%95%D7%95%D7%90%D7%A8%D7%9E%D7%94.mp3?alt=media&token=f3920959-c112-413b-b860-7ed78ea2942f", false, 0, true),
    //      new WordClass("", "דג", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%93%D7%92.mp3?alt=media&token=01ad8363-e9a0-4d53-85bc-7493486df809", false, 0, true),
    //     // new WordClass("", "טונה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%95%D7%A6%D7%A8%D7%99%20%D7%91%D7%A9%D7%A8%2F%D7%98%D7%95%D7%A0%D7%94.mp3?alt=media&token=4d87b233-6f14-4a57-8ae0-8d7371800a94", false, 0, true),
    //   ],

    //   [//מאכלים כללים
    //     new WordClass("", "אורז", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%90%D7%95%D7%A8%D7%96.mp3?alt=media&token=c61a5057-fe6a-4d6c-b8a1-1bc4034acde1", false, 0, true),
    //     new WordClass("", "פסטה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%A1%D7%98%D7%94.mp3?alt=media&token=c537efc6-8142-45f3-91cc-30bac420f7bb", false, 0, true),
    //     new WordClass("", "מרק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%9E%D7%A8%D7%A7.mp3?alt=media&token=c7fb70c3-6fce-4922-8fff-35e03555bd02", false, 0, true),
    //     new WordClass("", "חביתה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%97%D7%91%D7%99%D7%AA%D7%94.mp3?alt=media&token=6a4df95f-0736-4acd-9946-f76c1a39a120", false, 0, true),
    //   //   new WordClass("", "ירקות מבושלים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%20%D7%9E%D7%91%D7%95%D7%A9%D7%9C%D7%99%D7%9D.mp3?alt=media&token=d63121d4-c0e1-40fd-92ed-18f6bf4e2f48", false, 0, true),
    //      new WordClass("", "סלט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A1%D7%9C%D7%98.mp3?alt=media&token=a46c5785-74b8-409d-842d-5d120fe80250", false, 0, true),
    //   //   new WordClass("", "פתיתים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%AA%D7%99%D7%AA%D7%99%D7%9D.mp3?alt=media&token=deba197b-5647-45d4-9357-2071bc03270b", false, 0, true),
    //      new WordClass("", "פירה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%99%D7%A8%D7%94.mp3?alt=media&token=4df04dab-2a28-40a9-b196-17085402fa4b", false, 0, true),
    //   //   new WordClass("", "צ'יפס", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A6'%D7%99%D7%A4%D7%A1.mp3?alt=media&token=1483984c-546d-4cca-9a76-024c4b1088b4", false, 0, true),
    //   //   new WordClass("", "פיצה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%99%D7%A6%D7%94.mp3?alt=media&token=3eba3612-4ea4-4534-baf2-ed1feedaf566", false, 0, true),
    //   //   new WordClass("", "פלאפל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A4%D7%9C%D7%90%D7%A4%D7%9C.mp3?alt=media&token=c9092657-0fc0-429e-8c8e-2ed82c350349", false, 0, true),
    //   //   new WordClass("", "שקשוקה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A9%D7%A7%D7%A9%D7%95%D7%A7%D7%94.mp3?alt=media&token=26a39f07-b96e-4e1a-b9dc-2208df6c275d", false, 0, true),
    //   //   new WordClass("", "סושי", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A1%D7%95%D7%A9%D7%99.mp3?alt=media&token=1b02105c-f339-4f23-bb92-23af43cdb2dc", false, 0, true),
    //   //   new WordClass("", "קוגל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%9B%D7%9C%D7%99%D7%9D%20%D7%9B%D7%9C%D7%9C%D7%99%D7%9D%2F%D7%A7%D7%95%D7%92%D7%9C.mp3?alt=media&token=8a4040a1-d1e8-45b8-bb13-9f95a4a78df9", false, 0, true),
    //    ],

    //   [//מאפים
    //     new WordClass("", "לחם", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%9C%D7%97%D7%9D.mp3?alt=media&token=b4f2c668-3876-442f-9c29-2498b86c769d", false, 0, true),
    //   //   new WordClass("", "לחמניה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%9C%D7%97%D7%9E%D7%A0%D7%99%D7%94.mp3?alt=media&token=b3cfe48d-0e0b-4c58-9e40-65a8592e5988", false, 0, true),
    //   //   new WordClass("", "פיתה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%A4%D7%99%D7%AA%D7%94.mp3?alt=media&token=e283db0f-00ef-46c4-8c12-57f44b3ea521", false, 0, true),
    //   //   new WordClass("", "טוסט", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%98%D7%95%D7%A1%D7%98.mp3?alt=media&token=5afa3ffb-c956-4132-84bc-dfefc938b977", false, 0, true),
    //   //   new WordClass("", "בורקס", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%98%D7%95%D7%A1%D7%98.mp3?alt=media&token=5afa3ffb-c956-4132-84bc-dfefc938b977", false, 0, true),
    //   //   new WordClass("", "קרואסון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%90%D7%A4%D7%99%D7%9D%2F%D7%A7%D7%A8%D7%95%D7%90%D7%A1%D7%95%D7%9F.mp3?alt=media&token=131abb76-cf6a-47bf-9523-0cbc97fdd5cb", false, 0, true),
    //    ],

    //   [//קינוחים
    //     new WordClass("", "עוגה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A7%D7%99%D7%A0%D7%95%D7%97%D7%99%D7%9D%2F%D7%A2%D7%95%D7%92%D7%94.mp3?alt=media&token=9d020fbc-6b49-4172-a365-c5c4208405c1", false, 0, true),
    //     new WordClass("", "עוגיות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A7%D7%99%D7%A0%D7%95%D7%97%D7%99%D7%9D%2F%D7%A2%D7%95%D7%92%D7%99%D7%95%D7%AA.mp3?alt=media&token=c5a1f1f2-30b2-4ac4-ae4d-28f3e4bd7558", false, 0, true),
    //     new WordClass("", "גלידה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A7%D7%99%D7%A0%D7%95%D7%97%D7%99%D7%9D%2F%D7%92%D7%9C%D7%99%D7%93%D7%94.mp3?alt=media&token=f536cd95-04db-45e0-a2a9-02b2650530cb", false, 0, true),
    //   ],

    //   [//משקאות
    //     new WordClass("", "מים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%9E%D7%99%D7%9D.mp3?alt=media&token=cddbf894-5db8-46de-802f-e202c3ef98e8", false, 0, true),
    //   // new WordClass("", "מיץ", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%9E%D7%99%D7%A5.mp3?alt=media&token=7d1a6ba2-3fe4-41e5-aef9-7525eedb5b89", false, 0, true),
    //     new WordClass("", "סודה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%A1%D7%95%D7%93%D7%94.mp3?alt=media&token=d2bfc6ef-7886-4f22-97d8-ff2ef666d0b1", false, 0, true),
    //    // new WordClass("", "קולה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%A7%D7%95%D7%9C%D7%94.mp3?alt=media&token=7198b732-6e0c-4ae4-934a-cb3308e96ae8", false, 0, true),
    //     new WordClass("", "קפה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%A7%D7%A4%D7%94.mp3?alt=media&token=830fe69c-5450-4ad4-83fb-39d26531c943", false, 0, true),
    //     new WordClass("", "תה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%AA%D7%94.mp3?alt=media&token=b998f5b7-78fb-42dc-bdbc-f4c1068a23ec", false, 0, true),
    //    // new WordClass("", "יין", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%99%D7%99%D7%9F.mp3?alt=media&token=a17485c6-190b-4fcc-ab54-575746791cd9", false, 0, true),
    //    // new WordClass("", "בירה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%9E%D7%A9%D7%A7%D7%90%D7%95%D7%AA%2F%D7%91%D7%99%D7%A8%D7%94.mp3?alt=media&token=e1acbcb1-5794-4d15-b5b3-7892a7628b6d", false, 0, true),
    //   ],

    //   [//ירקות
    //     new WordClass("", "מלפפון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%9E%D7%9C%D7%A4%D7%A4%D7%95%D7%9F.mp3?alt=media&token=abcdf8ac-3459-49aa-a7a6-90e2808ccdb6", false, 0, true),
    //     new WordClass("", "עגבניה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%94.mp3?alt=media&token=bee3602b-c484-40d6-9155-e193144fb336", false, 0, true),
    //     new WordClass("", "גמבה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%92%D7%9E%D7%91%D7%94.mp3?alt=media&token=c311d4e1-8688-43e1-874a-1f3895c609a9", false, 0, true),
    //     new WordClass("", "פלפל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%A4%D7%9C%D7%A4%D7%9C.mp3?alt=media&token=5b19d091-1bd8-4097-ae39-b0f4fb130442", false, 0, true),
    //     new WordClass("", "בצל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%91%D7%A6%D7%9C.mp3?alt=media&token=ed894f8d-66b1-4ae4-a205-6312c1084cb7", false, 0, true),
    //     new WordClass("", "חסה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%97%D7%A1%D7%94.mp3?alt=media&token=8656e314-cc61-4350-979f-0f102868da8f", false, 0, true),
    //     new WordClass("", "גזר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%99%D7%A8%D7%A7%D7%95%D7%AA%2F%D7%92%D7%96%D7%A8.mp3?alt=media&token=da8b8201-3191-4bf3-a905-226775490614", false, 0, true),
    //   ],

    //   [//פירות
    //     new WordClass("", "תפוח", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%AA%D7%A4%D7%95%D7%97.mp3?alt=media&token=621a5491-f3c1-4872-9712-27b1f2f6ef29", false, 0, true),
    //     new WordClass("", "אגס", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%90%D7%92%D7%A1.mp3?alt=media&token=77a4a10b-8c65-45b4-9a80-a11f0fa3b2e3", false, 0, true),
    //     new WordClass("", "תפוז", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%AA%D7%A4%D7%95%D7%96.mp3?alt=media&token=0f69d6d9-4172-47e7-9897-78f5980c97fc", false, 0, true),
    //     new WordClass("", "ענבים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%A2%D7%A0%D7%91%D7%99%D7%9D.mp3?alt=media&token=ad263839-8c2a-49e2-977a-15b0f8dbf91a", false, 0, true),
    //     new WordClass("", "אבטיח", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%90%D7%91%D7%98%D7%99%D7%97.mp3?alt=media&token=f21de5a8-de87-4a74-adf0-e4f83a07170c", false, 0, true),
    //     new WordClass("", "מלון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%9E%D7%9C%D7%95%D7%9F.mp3?alt=media&token=09a6b91b-bd46-4e0f-9038-66074c41056c", false, 0, true),
    //     new WordClass("", "בננה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A4%D7%99%D7%A8%D7%95%D7%AA%2F%D7%91%D7%A0%D7%A0%D7%94.mp3?alt=media&token=77d1c70f-58ba-4a2c-a645-cd2dd25f5d1c", false, 0, true),
    //   ],

    //   [//רטבים, ממרחים ותבלינים
    //     new WordClass("", "קטשופ", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%A7%D7%98%D7%A9%D7%95%D7%A4.mp3?alt=media&token=bca80cd2-176f-48be-a893-57306e52fb7b", false, 0, true),
    //     new WordClass("", "חרדל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%97%D7%A8%D7%93%D7%9C.mp3?alt=media&token=d7ae8899-84df-471e-8790-50faff0247ea", false, 0, true),
    //     new WordClass("", "מיונז", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%9E%D7%99%D7%95%D7%A0%D7%96.mp3?alt=media&token=092e54d9-b31f-4d46-9303-d32dc0ed6ecd", false, 0, true),
    //     new WordClass("", "טחינה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%98%D7%97%D7%99%D7%A0%D7%94.mp3?alt=media&token=1f91a354-ddb6-4ec4-9fc6-158bedbd4105", false, 0, true),
    //     new WordClass("", "חומוס", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%97%D7%95%D7%9E%D7%95%D7%A1.mp3?alt=media&token=f85a7210-dcdd-45fc-8a1a-4b0de4beffd8", false, 0, true),
    //     new WordClass("", "צ'ילי מתוק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%A6'%D7%99%D7%9C%D7%99%20%D7%9E%D7%AA%D7%95%D7%A7.mp3?alt=media&token=2d3759f8-e601-42d0-8eeb-217aca83d074", false, 0, true),
    //     new WordClass("", "ממרח שוקולד", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%9E%D7%9E%D7%A8%D7%97%20%D7%A9%D7%95%D7%A7%D7%95%D7%9C%D7%93.mp3?alt=media&token=b8371f98-5efe-4014-bdb4-ee48686de65c", false, 0, true),
    //     new WordClass("", "מלח", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%9E%D7%9C%D7%97.mp3?alt=media&token=41f7b647-a758-4d25-8d70-ee737991c65b", false, 0, true),
    //     new WordClass("", "פלפל שחור", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%A4%D7%9C%D7%A4%D7%9C%20%D7%A9%D7%97%D7%95%D7%A8.mp3?alt=media&token=75d1221d-31c9-4f7b-94b1-5c6cdb26320c", false, 0, true),
    //     new WordClass("", "פפריקה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Ffood%2Faudio%2F%D7%A8%D7%98%D7%91%D7%99%D7%9D%2C%20%D7%9E%D7%9E%D7%A8%D7%97%D7%99%D7%9D%20%D7%95%D7%AA%D7%91%D7%9C%D7%99%D7%A0%D7%99%D7%9D%2F%D7%A4%D7%A4%D7%A8%D7%99%D7%A7%D7%94.mp3?alt=media&token=f30086cc-9892-47d8-8ab4-0d24cb806899", false, 0, true),
    //   ],

    // ];

    // this.add_new_cat_to_db(cat, words, subCats, subPhrases, false);


    // //MEDICINE CATEGORY
    // cat = new CategoryClass("רפואה", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fdoctors%2Fimages%2Fdoctors.PNG?alt=media&token=d5615126-71fd-41e7-8b28-2ad1bc7da7de", this.userEmail, "", 0, false, 5, true)

    // words = [];

    // subCats = [
    //   new CategoryClass("משפטים", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("סקלת כאב", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("אברי גוף", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("ראש", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("בטן", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("אף אוזן גרון", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2FOtolaryngology%2Fimages%2Fotolaryngology.PNG?alt=media&token=fc783d4f-bfa3-400f-81bf-5cf6f8b7ada5", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("חזה", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fchest%2Fimages%2Fchest.PNG?alt=media&token=c3570d3f-524e-415b-a87b-5f555b7ec91f", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("מצב נפשי", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("רופאים", "", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fdoctors%2Fimages%2Fdoctors.PNG?alt=media&token=d5615126-71fd-41e7-8b28-2ad1bc7da7de", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("אנשי מקצוע", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("בדיקות רפואיות", "", "", this.userEmail, "", 0, false, 0, true),
    //   new CategoryClass("סוגי כאב", "", "", this.userEmail, "", 0, false, 0, true),




    // ]

    // subPhrases = [
    //   [ // משפטים
    //     new WordClass("", "אני לא מרגיש טוב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%9C%D7%90%20%D7%9E%D7%A8%D7%92%D7%99%D7%A9%20%D7%98%D7%95%D7%91.mp3?alt=media&token=c53ab6d5-3caa-4e1e-b91b-61ab889aa838", false, 0, true),
    //     new WordClass("", "כואב לי...", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%9B%D7%95%D7%90%D7%91%20%D7%9C%D7%99.mp3?alt=media&token=855ac031-e389-4e36-9a60-11f8785fdbbb", false, 0, true),
    //     new WordClass("", "אני רוצה לראות אחות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%A8%D7%90%D7%95%D7%AA%20%D7%90%D7%97%D7%95%D7%AA.mp3?alt=media&token=e5739732-e23c-4b5a-8e77-04b185e2ca71", false, 0, true),
    //     new WordClass("", "אני רוצה להזמין תור לרופא", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%AA%D7%95%D7%A8%20%D7%9C%D7%A8%D7%95%D7%A4%D7%90.mp3?alt=media&token=100a0f3b-d780-4bae-a11b-8ccefbe567bf", false, 0, true),
    //     new WordClass("", "אני רוצה לקבל הפניה למיון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%94%D7%A4%D7%A0%D7%99%D7%94%20%D7%9C%D7%9E%D7%99%D7%95%D7%9F.mp3?alt=media&token=e62420e5-9f87-4045-9585-dc6423da5719", false, 0, true),
    //     new WordClass("", "אני צריך למדוד לחץ דם", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%9C%D7%9E%D7%93%D7%95%D7%93%20%D7%9C%D7%97%D7%A5%20%D7%93%D7%9D.mp3?alt=media&token=3286218a-9126-4c11-bc1a-9a5a99d761a4", false, 0, true),
    //     new WordClass("", "אני צריך בדיקת דם", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%93%D7%9D.mp3?alt=media&token=8b40668d-7006-45c7-baf1-74674158a34f", false, 0, true),
    //     new WordClass("", "אני צריך לקבל/לחדש מרשם", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A9%D7%A4%D7%98%D7%99%D7%9D%2F%D7%90%D7%A0%D7%99%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%90%D7%95%20%D7%9C%D7%97%D7%93%D7%A9%20%D7%9E%D7%A8%D7%A9%D7%9D.mp3?alt=media&token=9e06f6e7-6596-4a2f-9bc4-a13c0f4c3bf8", false, 0, true)

    //   ],

    //   [
    //     // סקלת כאב
    //     new WordClass("", "ביטוי לסקלת כאב", "", "", 0, "", false, 0, true)

    //   ],

    //   [ // אברי גוף
    //     new WordClass("", "אצבעות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%A6%D7%91%D7%A2%D7%95%D7%AA.mp3?alt=media&token=9855dd26-3f35-406f-bb17-acc87a324846", false, 0, true),
    //     new WordClass("", "יד", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%99%D7%93.mp3?alt=media&token=f5089854-f9b9-4825-879b-5ad431f72cb9", false, 0, true),
    //     new WordClass("", "רגל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A8%D7%92%D7%9C.mp3?alt=media&token=70041eb4-fb65-456c-ab19-8d2472625387", false, 0, true),
    //     new WordClass("", "ראש", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A8%D7%90%D7%A9.mp3?alt=media&token=4b9a23bb-1d01-4605-aca2-f3066ad18c43", false, 0, true),
    //     new WordClass("", "עיניים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A2%D7%99%D7%A0%D7%99%D7%99%D7%9D%20.mp3?alt=media&token=bbbc64ba-817b-4dff-b2c7-3d5bf9014d43", false, 0, true),
    //     new WordClass("", "אוזן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%95%D7%96%D7%9F.mp3?alt=media&token=9fc4d5ec-df8d-43c9-9281-7e700486db08", false, 0, true),
    //     new WordClass("", "אף", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%A3.mp3?alt=media&token=85731fe3-eafc-4b39-b316-36bdcf2c114d", false, 0, true),
    //     new WordClass("", "שיניים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A9%D7%99%D7%A0%D7%99%D7%99%D7%9D.mp3?alt=media&token=ac0e5c14-c1da-4256-b420-85d6ae45c35c", false, 0, true),
    //     new WordClass("", "פה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%A4%D7%94.mp3?alt=media&token=ff0cf821-6aa6-4685-bbdb-1cd5d748159e", false, 0, true),
    //     new WordClass("", "בטן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%91%D7%98%D7%9F.mp3?alt=media&token=bf72ac04-21db-4e99-98b2-5b78f4bcc14e", false, 0, true),
    //     new WordClass("", "גב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%92%D7%91.mp3?alt=media&token=4e4152f3-2ada-4954-ab71-65d139f44590", false, 0, true),
    //     new WordClass("", "לב", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%9C%D7%91.mp3?alt=media&token=ab558135-3572-4dc6-9bc3-b67a679119fe", false, 0, true),
    //     new WordClass("", "חזה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%97%D7%96%D7%94.mp3?alt=media&token=f14d1553-7630-4bb7-9a4e-78c1073382fb", false, 0, true),
    //     new WordClass("", "איבר מין", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%90%D7%99%D7%91%D7%A8%20%D7%9E%D7%99%D7%9F.mp3?alt=media&token=6f1c19b7-28bb-4fa5-a2a5-dde66f336b54", false, 0, true),
    //     new WordClass("", "ישבן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%99%D7%91%D7%A8%D7%99%20%D7%92%D7%95%D7%A3%2F%D7%99%D7%A9%D7%91%D7%9F.mp3?alt=media&token=3362ff09-e621-4eac-bfa7-98c15981fe01", false, 0, true)
    //   ],

    //   [// ראש
    //     new WordClass("", "כאב ראש", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fhead%2Fimages%2Fheadache.PNG?alt=media&token=d588a013-cc13-4e62-a792-ed5c32b53aff", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%9B%D7%90%D7%91%20%D7%A8%D7%90%D7%A9.mp3?alt=media&token=b4c9d1be-8829-4028-8d8b-232f3c0b4ffa", false, 0, true),
    //     new WordClass("", "סחרחורת", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fhead%2Fimages%2Fdizziness.PNG?alt=media&token=0605400e-030c-40bd-8a8b-a05c0c07267c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%A1%D7%97%D7%A8%D7%97%D7%95%D7%A8%D7%AA.mp3?alt=media&token=eb590725-a8ac-4ec5-8452-1e7d06da3890", false, 0, true),
    //     new WordClass("", "עייפות", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fhead%2Fimages%2F%25E2%2580%258F%25E2%2580%258Fsleepy.PNG?alt=media&token=2efec807-3efa-4013-9a6d-26fea7025bee", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%A2%D7%99%D7%99%D7%A4%D7%95%D7%AA.mp3?alt=media&token=6ea45d5b-aad6-4c55-96c7-95f060ccac46", false, 0, true),
    //     new WordClass("", "חום", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fhead%2Fimages%2F%25E2%2580%258F%25E2%2580%258Fmedical_thermometer.PNG?alt=media&token=09ae617d-48b1-4a97-bdb8-43f30c8635b5", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%97%D7%95%D7%9D%20.mp3?alt=media&token=772f8b98-726a-4fb4-b2af-dd95f6d8678e", false, 0, true),
    //     new WordClass("", "ראיה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%A8%D7%90%D7%99%D7%94.mp3?alt=media&token=c2243516-aebc-4405-a54c-0fe23ecddb6b", false, 0, true),
    //     new WordClass("", "שמיעה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%A9%D7%9E%D7%99%D7%A2%D7%94.mp3?alt=media&token=e0ba8e91-0c1a-4def-8d8a-890f7f61db77", false, 0, true),
    //     new WordClass("", "עילפון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%A2%D7%99%D7%9C%D7%A4%D7%95%D7%9F.mp3?alt=media&token=60f307f3-ce6c-4d72-88ed-5c0f5fda4778", false, 0, true),
    //     new WordClass("", "שיווי משקל", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%90%D7%A9%2F%D7%A9%D7%99%D7%95%D7%95%D7%99%20%D7%9E%D7%A9%D7%A7%D7%9C.mp3?alt=media&token=6a99ae29-0ca5-4da4-89a4-aeb33a58ce6a", false, 0, true)
    //   ],

    //   [ // בטן
    //     new WordClass("", "כאב בטן", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fstomach%2Fimages%2Fstomach.PNG?alt=media&token=6ce2014d-f8af-4ec2-9ee4-b28bd7aeac3b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%9B%D7%90%D7%91%20%D7%91%D7%98%D7%9F.mp3?alt=media&token=4f88310d-a3fd-46e3-9905-f8a0a7d893ae", false, 0, true),
    //     new WordClass("", "הקאות", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fstomach%2Fimages%2Fvomit.PNG?alt=media&token=dbc535a1-9c84-4645-b508-a97b3a269ea6", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%94%D7%A7%D7%90%D7%95%D7%AA.mp3?alt=media&token=5e4cd002-c61a-4976-a955-973da3cd9cc9", false, 0, true),
    //     new WordClass("", "עצירות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%A2%D7%A6%D7%99%D7%A8%D7%95%D7%AA.mp3?alt=media&token=5b20c1c0-eece-4778-b6ef-ec58b6297491", false, 0, true),
    //     new WordClass("", "שלשולים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%A9%D7%9C%D7%A9%D7%95%D7%9C%D7%99%D7%9D.mp3?alt=media&token=f40099af-2274-4e0f-9ab5-8df872424b59", false, 0, true),
    //     new WordClass("", "כאבי מחזור", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%9B%D7%90%D7%91%D7%99%20%D7%9E%D7%97%D7%96%D7%95%D7%A8.mp3?alt=media&token=ce34e4ce-74e3-4010-91bf-9f12dbb46149", false, 0, true),
    //     new WordClass("", "שתן", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%A9%D7%AA%D7%9F.mp3?alt=media&token=293d884a-f45b-4636-928a-0231573d1669", false, 0, true),
    //     new WordClass("", "טחורים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%98%D7%97%D7%95%D7%A8%D7%99%D7%9D.mp3?alt=media&token=99e33fd6-3468-45fa-9d70-13355e4895d0", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%98%D7%9F%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=fe8af62e-bd94-40cb-a651-ad92c20cb73f", false, 0, true)

    //   ],

    //   [ // אף אוזן גרון
    //     new WordClass("", "כאב אוזניים", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2FOtolaryngology%2Fimages%2Fear_pain.PNG?alt=media&token=0c60224b-ac73-4978-af14-c07aa080124c", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%9B%D7%90%D7%91%20%D7%90%D7%95%D7%96%D7%A0%D7%99%D7%99%D7%9D.mp3?alt=media&token=08c4c68e-8377-4a5a-87ee-7d766589b3aa", false, 0, true),
    //     new WordClass("", "כאב גרון", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2FOtolaryngology%2Fimages%2Fsore_throat.PNG?alt=media&token=a7a94613-53bd-4a53-b4ae-4e9bd8fb16a2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%9B%D7%90%D7%91%20%D7%92%D7%A8%D7%95%D7%9F.mp3?alt=media&token=bc987bdf-f03d-48e9-8b34-779d64252f14", false, 0, true),
    //     new WordClass("", "צינון", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2FOtolaryngology%2Fimages%2Fnose%20pain.PNG?alt=media&token=e5b44151-2e62-47b9-a06e-e894a5803e0b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%A6%D7%99%D7%A0%D7%95%D7%9F.mp3?alt=media&token=8b4b6757-8df5-4acd-a135-7b31e0897520", false, 0, true),
    //     new WordClass("", "שיעול", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%A9%D7%99%D7%A2%D7%95%D7%9C.mp3?alt=media&token=a23734c2-a9bc-4c41-a4cd-8f10c8d563e0", false, 0, true),
    //     new WordClass("", "צרידות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%A6%D7%A8%D7%99%D7%93%D7%95%D7%AA.mp3?alt=media&token=9bd316f6-3ef3-4e21-bdf1-299e3042237c", false, 0, true),
    //     new WordClass("", "קושי בבליעה", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2FOtolaryngology%2Fimages%2Fsore_throat.PNG?alt=media&token=a7a94613-53bd-4a53-b4ae-4e9bd8fb16a2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%A7%D7%95%D7%A9%D7%99%20%D7%91%D7%91%D7%9C%D7%99%D7%A2%D7%94.mp3?alt=media&token=7b71dcf0-cff6-418c-a063-744495ae36cd", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=e85e3dd4-47e4-4bb5-966a-8bb480fa11c8", false, 0, true)
    //   ],

    //   [ // חזה
    //     new WordClass("", "בחילות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%97%D7%96%D7%94%2F%D7%91%D7%97%D7%99%D7%9C%D7%95%D7%AA.mp3?alt=media&token=e0c698f2-0149-4904-9aaf-56ba366ae2f5", false, 0, true),
    //     new WordClass("", "צרבת", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fchest%2Fimages%2Fheartburn.PNG?alt=media&token=ad70adf3-2fa4-4cbb-b07d-453bbed8d0c2", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%97%D7%96%D7%94%2F%D7%A6%D7%A8%D7%91%D7%AA.mp3?alt=media&token=6832021c-418b-4118-8b25-0dcdf9b097db", false, 0, true),
    //     new WordClass("", "כאב בחזה", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fchest%2Fimages%2Fchest.PNG?alt=media&token=c3570d3f-524e-415b-a87b-5f555b7ec91f", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%97%D7%96%D7%94%2F%D7%9B%D7%90%D7%91%20%D7%91%D7%97%D7%96%D7%94.mp3?alt=media&token=49471db0-cbf2-4451-a62f-9101da651e1c", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%97%D7%96%D7%94%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=c9a1f6b5-49ac-41be-8925-39d81652a3a4", false, 0, true)
    //   ],

    //   [ // מצב נפשי
    //     new WordClass("", "דיכאון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%93%D7%99%D7%9B%D7%90%D7%95%D7%9F.mp3?alt=media&token=57268e01-5f2e-4c49-b15a-e22e182aa68f", false, 0, true),
    //     new WordClass("", "חרדה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%97%D7%A8%D7%93%D7%94.mp3?alt=media&token=f8a2ea7e-c8de-4eba-bca1-5bdfedd79ebc", false, 0, true),
    //     new WordClass("", "בדידות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%91%D7%93%D7%99%D7%93%D7%95%D7%AA.mp3?alt=media&token=ade344bf-85fc-4707-a7b0-fcc5b3e675cb", false, 0, true),
    //     new WordClass("", "קשיים בזוגיות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%A7%D7%A9%D7%99%D7%99%D7%9D%20%D7%91%D7%96%D7%95%D7%92%D7%99%D7%95%D7%AA.mp3?alt=media&token=b227bb09-6895-4c23-94a5-65ecbb43af33", false, 0, true),
    //     new WordClass("", "קושי בהירדמות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%A7%D7%95%D7%A9%D7%99%20%D7%91%D7%94%D7%99%D7%A8%D7%93%D7%9E%D7%95%D7%AA.mp3?alt=media&token=01cf7e2a-a78a-4fe9-8d49-d301504cc17a", false, 0, true),
    //     new WordClass("", "מחשבות אובדניות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%AA%20%D7%90%D7%95%D7%91%D7%93%D7%A0%D7%99%D7%95%D7%AA.mp3?alt=media&token=c3a60e30-0f71-4dda-984a-c16d0a82b931", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%9E%D7%A6%D7%91%20%D7%A0%D7%A4%D7%A9%D7%99%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=a45c2cb6-38d0-420c-af37-d87a59e741a4", false, 0, true)
    //   ],

    //   [ // רופאים
    //     new WordClass("", "רופא משפחה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A8%D7%95%D7%A4%D7%90%20%D7%9E%D7%A9%D7%A4%D7%97%D7%94.mp3?alt=media&token=b874921f-cb12-47a5-aada-543f51e2ec13", false, 0, true),
    //     new WordClass("", "נוירולוג", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A0%D7%95%D7%99%D7%A8%D7%95%D7%9C%D7%95%D7%92.mp3?alt=media&token=c5589221-c7cf-4a3f-a1d1-20a0b25b6d60", false, 0, true),
    //     new WordClass("", "קרדיולוג", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A7%D7%A8%D7%93%D7%99%D7%95%D7%9C%D7%95%D7%92.mp3?alt=media&token=4850d5ce-5120-4fe3-8476-2b128df1fea9", false, 0, true),
    //     new WordClass("", "אף אוזן גרון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%90%D7%A3%20%D7%90%D7%95%D7%96%D7%9F%20%D7%92%D7%A8%D7%95%D7%9F.mp3?alt=media&token=d36ee650-ab4e-4df3-8469-e94e9e4616c7", false, 0, true),
    //     new WordClass("", "אורתופד", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%90%D7%95%D7%A8%D7%AA%D7%95%D7%A4%D7%93.mp3?alt=media&token=6105c52f-1d1d-49e1-b247-cca562296576", false, 0, true),
    //     new WordClass("", "רופא עיניים", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A8%D7%95%D7%A4%D7%90%20%D7%A2%D7%99%D7%A0%D7%99%D7%99%D7%9D.mp3?alt=media&token=d682c09a-2ead-47da-84a8-a7717936bbaa", false, 0, true),
    //     new WordClass("", "רופא עור", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%A8%D7%95%D7%A4%D7%90%20%D7%A2%D7%95%D7%A8.mp3?alt=media&token=683f1e48-48e2-4989-8a5b-98abe83be167", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A8%D7%95%D7%A4%D7%90%D7%99%D7%9D%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=c4302018-3dc4-46ad-930b-89cfe6912f76", false, 0, true)

    //   ],

    //   [ // אנשי מקצוע
    //     new WordClass("", "קלינאי/ת תקשורת", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A7%D7%9C%D7%99%D7%A0%D7%90%D7%99%D7%AA%20%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA.mp3?alt=media&token=0f8ad72a-8df1-40a9-9350-7bb89c426b52", false, 0, true),
    //     new WordClass("", "פיזיותרפיה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A4%D7%99%D7%96%D7%99%D7%95%D7%AA%D7%A8%D7%A4%D7%99%D7%94.mp3?alt=media&token=fa34bb46-8848-4c07-bbd2-0d2887eeb303", false, 0, true),
    //     new WordClass("", "ריפוי בעיסוק", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A8%D7%99%D7%A4%D7%95%D7%99%20%D7%91%D7%A2%D7%99%D7%A1%D7%95%D7%A7.mp3?alt=media&token=7e7bc9d0-aea7-452a-9642-52c45318851d", false, 0, true),
    //     new WordClass("", "עובדת סוציאלית", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A2%D7%95%D7%91%D7%93%D7%AA%20%D7%A1%D7%95%D7%A6%D7%99%D7%90%D7%9C%D7%99%D7%AA.mp3?alt=media&token=74300909-9373-4fd9-a136-8e7b74385c66", false, 0, true),
    //     new WordClass("", "פסיכולוג", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%A4%D7%99%D7%A1%D7%9B%D7%95%D7%9C%D7%95%D7%92.mp3?alt=media&token=a7f9c6ec-ee4d-447b-ad06-15c17bc52391", false, 0, true),
    //     new WordClass("", "דיאטנית", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%93%D7%99%D7%90%D7%98%D7%A0%D7%99%D7%AA.mp3?alt=media&token=6292bc78-ffe9-41fb-86b8-3ee561684c9a", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%90%D7%A0%D7%A9%D7%99%20%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=cf621fac-9dad-46f7-895c-109e33b1c009", false, 0, true)
    //   ],

    //   [ // בדיקות רפואיות
    //     new WordClass("", "מרשם לתרופות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%9E%D7%A8%D7%A9%D7%9D%20%D7%9C%D7%AA%D7%A8%D7%95%D7%A4%D7%95%D7%AA%20.mp3?alt=media&token=a1aaaf53-d7e7-4121-ac6a-56abf5bf4efa", false, 0, true),
    //     new WordClass("", "בדיקות דם", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%93%D7%9D.mp3?alt=media&token=10de1b00-4bd6-4823-af4c-d4a4b8072536", false, 0, true),
    //     new WordClass("", "חיסון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%97%D7%99%D7%A1%D7%95%D7%9F.mp3?alt=media&token=8983d119-1044-4694-beb4-344c8edfec07", false, 0, true),
    //     new WordClass("", "צילום", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%A6%D7%99%D7%9C%D7%95%D7%9D.mp3?alt=media&token=e155a1b4-fcc4-465d-b57a-f6b06e5f5645", false, 0, true),
    //     new WordClass("", "הפניה למומחה", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%94%D7%A4%D7%A0%D7%99%D7%94%20%D7%9C%D7%9E%D7%95%D7%9E%D7%97%D7%94.mp3?alt=media&token=fe43a498-c465-4a46-bc31-509248628a26", false, 0, true),
    //     new WordClass("", "התחייבות", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%94%D7%AA%D7%97%D7%99%D7%99%D7%91%D7%95%D7%AA.mp3?alt=media&token=e4573521-e13f-4f7f-8f2e-436944b316ec", false, 0, true),
    //     new WordClass("", "הפניה למיון", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%94%D7%A4%D7%A0%D7%99%D7%94%20%D7%9C%D7%9E%D7%99%D7%95%D7%9F.mp3?alt=media&token=4f5c7bd2-37dc-4469-8424-f2d3f31e1952", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%95%D7%AA%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=a68c76f9-5d95-4bff-82f7-f34a5174f8b7", false, 0, true)
    //   ],

    //   [ // סוגי כאב
    //     new WordClass("", "מגרד", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fpain%2Fimages%2Fitchy.PNG?alt=media&token=6a522255-9f38-4f59-a607-8e2a78ffd5b3", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A1%D7%95%D7%92%D7%99%20%D7%9B%D7%90%D7%91%2F%D7%9E%D7%92%D7%A8%D7%93.mp3?alt=media&token=cc4ac533-48ad-4b6b-bbb1-311fa7bbb274", false, 0, true),
    //     new WordClass("", "שורף", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fpain%2Fimages%2Fburning_pain.PNG?alt=media&token=83f94433-3d41-466c-8601-29c9dc39c34b", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A1%D7%95%D7%92%D7%99%20%D7%9B%D7%90%D7%91%2F%D7%A9%D7%95%D7%A8%D7%A3.mp3?alt=media&token=fbbfba13-daba-4013-9867-bcb47c4e1489", false, 0, true),
    //     new WordClass("", "פועם", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A1%D7%95%D7%92%D7%99%20%D7%9B%D7%90%D7%91%2F%D7%A4%D7%95%D7%A2%D7%9D.mp3?alt=media&token=4e1c4737-e163-40aa-aac4-4a707e6afc14", false, 0, true),
    //     new WordClass("", "דוקר", "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Fpain%2Fimages%2Fstabbing_pain.PNG?alt=media&token=f1d5777e-d031-4d3b-ae99-5d364139eab9", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A1%D7%95%D7%92%D7%99%20%D7%9B%D7%90%D7%91%2F%D7%93%D7%95%D7%A7%D7%A8.mp3?alt=media&token=ead5a7de-b5e5-4ffa-807d-091ee3a8b748", false, 0, true),
    //     new WordClass("", "אחר", "", "", 0, "https://firebasestorage.googleapis.com/v0/b/lets-talk-b433e.appspot.com/o/app-builder%2Fmadical%2Faudio%2F%D7%A1%D7%95%D7%92%D7%99%20%D7%9B%D7%90%D7%91%2F%D7%90%D7%97%D7%A8.mp3?alt=media&token=2de44444-e03b-4c3d-ac18-e3ccfca9d615", false, 0, true)
    //   ]
    // ];

    // this.add_new_cat_to_db(cat, words, subCats, subPhrases, false);

    //
  }

}
