window.addEventListener("load",function(){
  const storeCover = document.querySelector("#storeCover");
  const updateCover = document.querySelector("#updateCover");
  tinymce.init({
      height:640,
      width:800,
      selector: 'textarea#contentUpdate, textarea#contentNew',
      entity_encoding : "raw",
      plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak ' +
    'searchreplace wordcount visualblocks visualchars code fullscreen ' +
    'insertdatetime media nonbreaking save table contextmenu directionality ' +
    'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc',
    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    toolbar2: 'print preview media | forecolor backcolor emoticons ',
    apply_source_formatting : false,             
    verify_html : false,   
    image_advtab: true,
    image_title: true,
  //   images_reuse_filename: true,
    automatic_uploads: true,
    // URL of our upload handler
    // here we add custom filepicker only to Image dialog
    file_picker_types: 'image',
    images_upload_url: '/upload',
    file_picker_callback: function (callback, value, meta) {
      if (meta.filetype == 'image') {
        $('#upload').trigger('click');
        $('#upload').on('change', function () {
          var file = this.files[ 0 ];
          var reader = new FileReader();
          reader.onload = function (e) {
            callback(e.target.result, {
              alt: ''
            });
          };
          reader.readAsDataURL(file);
        });
      }
    },
     
      images_upload_handler: function (blobInfo, success, failure) {
          var xhr, formData;
          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', '/upload');
          xhr.onload = function() {
            var json;
      
            if (xhr.status != 200) {
              failure('HTTP Error: ' + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);
      
            if (!json || typeof json.location != 'string') {
              failure('Invalid JSON: ' + xhr.responseText);
              return;
            }
            success(json.location);
          };
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          xhr.send(formData);
      },
  
      setup: function (editor) {
          editor.on('SaveContent', function (e) {
            let cover = editor.dom.select('img')[0];
            console.log(e);
            if(cover){
             let coverImg = editor.selection.select(cover).src;
             if(storeCover){
              storeCover.setAttribute("value",`${coverImg}`);
             }
             if(updateCover){
              updateCover.setAttribute("value",`${coverImg}`);
             }
            }
          });
        }
     
 });

  displayAdv();
  setInterval(displayAdv,10000);
  assignCover();
 
  //sort functionality
  const allOptions = document.querySelector(".sort_menu");
  if(allOptions){
  allOptions.addEventListener("change",async function(){
           let index= allOptions.selectedIndex;
           let option = allOptions.options[index].value;
           let sortedArticle = await fetch(`./sortBy?sortBy=${option}`);
           let sortedArray = await sortedArticle.json();
           displayArticle(sortedArray);
  });
  }
  async function displayArticle(sortedArray){
      const articleList = document.querySelector(".grid-other");
      articleList.innerHTML=``;
      for(eachobj of sortedArray){
      //    better version
         if(eachobj.article_image){
          articleList.innerHTML += `
          <div class="card">
              <a href="./articleDetails?article_id=${eachobj.article_id}">
              <img class="card-image" src=${eachobj.article_image}>
              </a>
              <div class="little_body1">
                 <h4>${eachobj.title}</h4>    
                 <p>${eachobj.post_date}</p>
              </div>
              <hr>
              <div class="little_body2">
                <img src="./images/avatar/${eachobj.avatar_icon}" class="avatar_other">
                <p>${eachobj.username}</p>
              </div>
          </div>
          `;
         }else{
          const random = Math.floor(Math.random()*4)+4;
          const allDefaultCovers =  await assignCover();
          articleList.innerHTML += `
          <div class="card">
              <a href="./articleDetails?article_id=${eachobj.article_id}">
              <img class="card-image" src="./images/cover/${allDefaultCovers[random]}">
              </a>
              <div class="little_body1">
                 <h4>${eachobj.title}</h4>    
                 <p>${eachobj.post_date}</p>
              </div>
              <hr>
              <div class="little_body2">
                <img src="./images/avatar/${eachobj.avatar_icon}" class="avatar_other">
                <p>${eachobj.username}</p>
              </div>
          </div>
          `;
         }
      }
  };
  //adv functionality
  async function displayAdv(){
        const adv1 = document.querySelector("#adv1");
        const adv2 = document.querySelector("#adv2");
        let advJson = await fetch ("./adv");
        let advArray = await advJson.json();
        const randomNum1 = Math.floor(Math.random()*5)+1;
        const randomNum2 = Math.floor(Math.random()*5)+6;
        if(adv1||adv2){
        adv1.setAttribute("src", `./images/advs/${advArray[randomNum1]}`);
        adv2.setAttribute("src", `./images/advs/${advArray[randomNum2]}`);
        }
  };

  //cover functionality
 async function assignCover(){
  const coverJson = await fetch ("./cover");
  const coverArray = await coverJson.json();
  const defaultCoverAry = document.querySelectorAll(".defaultCover");
  if(defaultCoverAry){
    for(eachDefaultCover of defaultCoverAry){
      const random = Math.floor(Math.random()*4)+4;
      eachDefaultCover.setAttribute("src", `./images/cover/${coverArray[random]}`);
    }
  }
  return coverArray;
};
  //delete article
  const deleteBtn = document.querySelector("#deleteArticle");
  if(deleteBtn){
      deleteBtn.addEventListener("click", async function(){
      const check = confirm("Do you want to delete your article?");
      if(check){
        //submit form
      }else{
        deleteBtn.setAttribute("formaction", "./updateNew");
      }
    });
  }

});


