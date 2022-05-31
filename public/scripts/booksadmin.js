booksnumber=books.length;
str=""
for(i=0;i<booksnumber;i++){
    console.log(uname);
    if(books[i].issued_by!==null){
        str=str+`<tr><td style="padding:10px">${books[i].bid}</td><td style="padding:10px">${books[i].bname}</td><td style="padding:10px">${books[i].issued_by}</td></tr>`
    }
    else{
        str=str+`<tr><td style="padding:10px">${books[i].bid}</td><td style="padding:10px">${books[i].bname}</td><td style="padding:10px">Unissued</td></tr>`
    }
}
document.getElementById("booklist").innerHTML=str;