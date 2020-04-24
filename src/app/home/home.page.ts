import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  books = [];
  
  

  constructor(private http: HttpClient, private router: Router, private storage: Storage) {}

  ionViewWillEnter() {
    this.books = [];
    this.http.get('https://pytt.at/!/learning/json/1dylza')
      .subscribe((data: any) => {
        // console.log(data);
        data.books.forEach((book) => {
          this.books.push({
            title: book.title,
            author: book.author,
            isbn: book.isbn
          });
        });
    });
  }

  async clearCache() {
    await this.storage.clear();
    console.log('cache cleared');
  }


  async delete(isbn: string){
    await this.storage.remove(isbn);
    console.log('Cache für ' + isbn + ' wurde gelöscht')
  }



  async loadBook(isbn: string) {

    try {
      const localData = await this.storage.get(isbn);

      let book: any = {};

      if (localData != null) {
        console.log('use local data');
        let localObj = JSON.parse(localData);
        book = localObj;
      }
      else {
        console.log('use google api');
        let url: string = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;

        const apiData: any = await this.http.get(url).toPromise();

        if (apiData.totalItems == 1) {
          book.title = apiData.items[0].volumeInfo.title;
          book.description = apiData.items[0].volumeInfo.description;
          book.subtitle = apiData.items[0].volumeInfo.subtitle;
        }

        await this.storage.set(isbn, JSON.stringify(book));
      }
      

      let extras: NavigationExtras = {
        state: {
          isbn: isbn,
          title: book.title,
          subtitle: book.subtitle,
          description: book.description
        }
      };

      this.router.navigate(['/details'], extras);


    } catch (err) {
      console.log('Fehler: ' + err);
    }
    
    
  }

}
