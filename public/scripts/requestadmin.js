booksnumber=books.length
str=""
for(i=0;i<booksnumber;i++){
    console.log(books[i].requested_by);
    str=str+`<tr><td style="padding:10px">${books[i].bid}</td><td style="padding:10px">${books[i].bname}</td><td>${books[i].requested_by}</td><td style="padding:10px"><form action="/approve" method="POST"><input type="text" value=`+books[i].requested_by+` name="username" style="display:none"><input type="text" value=`+books[i].bid+` name="bookid" style="display:none"><input type="submit" value="Approve"></form></td><td style="padding:10px"><form action="/deny" method="POST"><input type="text" value=`+books[i].requested_by+` name="username" style="display:none"><input type="text" value=`+books[i].bid+` name="bookid" style="display:none"><input type="submit" value="Deny"></form></td></tr>`
};
document.getElementById("requestlist").innerHTML=str;

