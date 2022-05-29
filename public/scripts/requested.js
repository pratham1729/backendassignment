booksnumber=books.length
str=""
for(i=0;i<booksnumber;i++){
    console.log(books[i].bname);
    str=str+`<tr><td>${books[i].bid}</td><td>${books[i].bname}</td><td><form action="/cancelrequest" method="POST"><input type="text" value=`+uname+` name="username" style="display:none"><input type="text" value=`+books[i].bid+` name="bookid" style="display:none"><input type="submit" value="cancelrequest"></form></td></tr>`
}
document.getElementById("requestedbooklist").innerHTML=str;