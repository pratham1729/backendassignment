booksnumber=books.length
str=""
for(i=0;i<booksnumber;i++){
    console.log(uname);
    if(books[i].issued_by===uname){
        str=str+`<tr><td style="padding:10px">${books[i].bid}</td><td style="padding:10px">${books[i].bname}</td><td style="padding:10px"><form action="/return" method="POST"><input type="text" value=`+uname+` name="username" style="display:none"><input type="text" value=`+books[i].bid+` name="bookid" style="display:none"><input type="submit" value="Return"></form></td></tr>`
    }
}
document.getElementById("issuedbooklist").innerHTML=str;