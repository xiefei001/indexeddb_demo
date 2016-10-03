import {Component} from '@angular/core';
import {ImagesService} from "./images.service";


class Task {
  title: string;
  text: string;
}

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html'
})
export class AppComponent {

  private db: IDBDatabase;
  private task: Task = new Task();
  private tasks: Array<Task> = [];

  private files: Array<File> = [];

  constructor(private imagesService: ImagesService) {
    let request: IDBOpenDBRequest = indexedDB.open('testDatabase', 1);
    request.onsuccess = (event) => {
      this.db = request.result;
      console.log(this.db);
    };
    request.onerror = (error) => {
      console.log('error: ' + JSON.stringify(error.target));
      debugger;
    };

    request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      this.db = (<IDBOpenDBRequest>ev.target).result;
      this.db.createObjectStore('taskStore', {keyPath: 'title'});

      this.db.createObjectStore('fileStore', {keyPath: 'name'});
      console.log('object stores created');


    };
  }

  saveTask() {
    if (this.task && this.task.title && this.task.text) {
      let txn: IDBTransaction = this.db.transaction(['taskStore'], 'readwrite');
      let objectStore: IDBObjectStore = txn.objectStore('taskStore');
      let request: IDBRequest = objectStore.put(this.task);
      request.onsuccess = (event) => {
        let result = (<IDBOpenDBRequest>event.target).result;
        console.log('save success object: ' + result);
        this.task = new Task();
        this.getAllTasks();
      };
      request.onerror = (event) => {
        var result = (<IDBOpenDBRequest>event.target).result;
        console.log("error: " + result);
      }
    }
  }

  getAllTasks() {
    let objectStore = this.db.transaction(['taskStore']).objectStore('taskStore');
    let cursor: IDBRequest = objectStore.openCursor();
    let data: Array<Task> = [];
    cursor.onsuccess = (e) => {
      let result = (<IDBOpenDBRequest>event.target).result;
      if (result && result !== null) {
        data.push(result.value);
        result.continue();
      } else {
        this.tasks.push(...data);
      }
    };
  }

  onImageSelected(event: any) {
    let file: File = event.target.files[0];
    var objectStore = this.db.transaction(['fileStore'], 'readwrite')
      .objectStore('fileStore');
    let request: IDBRequest = objectStore.put(file);
    request.onsuccess = (e) => {
      let result = (<IDBOpenDBRequest>event.target).result;
      console.log('save success file: ' + result);
      this.updateFiles();
    }
  }

  updateFiles() {
    let objectStore = this.db.transaction(['fileStore']).objectStore('fileStore');
    let cursor: IDBRequest = objectStore.openCursor();
    this.files.splice(0, this.files.length);
    cursor.onsuccess = (e) => {
      let result = (<IDBOpenDBRequest>event.target).result;
      if (result && result !== null) {
        this.files.push(result.value);
        result.continue();
        console.log("load file: " + result.value);
      }
    };
  }


  read(file: File, img: any) {
    let fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', ()=> {
      console.log(fileReader.result);
      console.log(img);
      img.nativeElement.src = fileReader.result;
    });
  }


  onFileSelected(event: any) {
    let file: File = event.target.files[0];
    this.imagesService.storeFile(file);
  }

}
