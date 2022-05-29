booksnumber=books.length;
requestsnumber=requests.length;
str=""
for(i=0;i<booksnumber;i++){
    console.log(uname);
    if(books[i].issued_by===null){
        str=str+`<tr><td>${books[i].bid}</td><td>${books[i].bname}</td><td><form action="/makerequest" method="POST"><input type="text" value=`+uname+` name="username" style="display:none"><input type="text" value=`+books[i].bname+` name="bookname" style="display:none"><input type="text" value=`+books[i].bid+` name="bookid" style="display:none"><input type="submit" value="Request"></form></td></tr>`
    }
    else{
        if(books[i].issued_by===uname){
            str=str+`<tr><td>${books[i].bid}</td><td>${books[i].bname}</td><td>${`Issued to you`}</td></tr>`
            break
        }
        else{
            str=str+`<tr><td>${books[i].bid}</td><td>${books[i].bname}</td><td>${`Not available`}</td></tr>`
            break
        }
    }
}
document.getElementById("booklist").innerHTML=str;