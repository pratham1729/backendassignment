reqnumber=request.length
str2=""
for(i=0;i<reqnumber;i++){
    str2=str2+`<tr><td>${request[i].uname}</td><td><form action="/approvereq" method="POST"><input type="text" value=`+request[i].uname+` name="username" style="display:none"><input type="text" value=`+request[i].password+` name="password" style="display:none"><input type="submit" value="Approve"></form></td><td><form action="/denyreq" method="POST"><input type="text" value=`+request[i].uname+` name="username" style="display:none"><input type="text" value=`+request[i].password+` name="password" style="display:none"><input type="submit" value="Deny"></form></td></tr>`
};
console.log(request)
document.getElementById("registerlist").innerHTML=str2;