import {Injectable} from "@angular/core";

const MAX_FILE_SIZE: number = 15 * 1024 * 1024;

@Injectable()
export class ImagesService {

  convertBlobToFile(blob: Blob, fileName: string): File {
    let result: any = blob;
    result.lastModifiedDate = new Date();
    result.name = fileName;
    return <File> result;
  }


  storeFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      console.log("Datei ist zu groß und wird ignoriert!");
      return;
    }
    console.log("filetype: " +  file.type.toString());
    if (!file.type.match(/image.*/)) {
      console.log('Datei ist kein Image und wird ignoriert');
      return;
    }

    let img: HTMLImageElement = document.createElement('img');
    img.onload = (event: any) => {
      //var canvas: any = document.getElementById('canvas'); //document.createElement('canvas');
      var canvas: HTMLCanvasElement = document.createElement('canvas');
      console.log(canvas.constructor);
      var context = canvas.getContext('2d');

      // step 1
      canvas.width = img.width * 0.5;
      canvas.height = img.height * 0.5;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // step 2
      //context.drawImage(canvas, 0, 0, canvas.width * 0.5, canvas.height * 0.5);

      // step 3
      //context.drawImage(canvas, 0, 0, canvas.width * 0.5, canvas.height * 0.5, 0, 0, canvas.with, canvas.height);

      let blob: Blob = canvas.msToBlob();
      let result: File = this.convertBlobToFile(blob, 'test.png');
      console.log(result.name);

    };
    img.src = URL.createObjectURL(file);


    //context.drawImage();


    let reader: FileReader = new FileReader();

    reader.onerror = (event) => {
      console.log(event);
    };

    reader.onload = (event: any) => {
      var target = event.target;
      //console.log(target.result);

      //console.log(target.result);
    };
    reader.readAsDataURL(file);
  }
}
