booksnumber=books.length
console.log(books)
str=""
for(i=0;i<booksnumber;i++){
    str=str+`<tr><td style="padding:10px">${books[i].bid}</td><td style="padding:10px">${books[i].bname}</td><td style="padding:10px"><form action="/cancelrequest" method="POST"><input type="text" value=`+uname+` name="username" style="display:none"><input type="text" value=`+books[i].bid+` name="bookid" style="display:none"><input type="submit" value="Cancel Request"></form></td></tr>`
}
document.getElementById("requestedbooklist").innerHTML=str;