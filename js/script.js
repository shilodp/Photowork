var token='';
	var uid='';
	var title='';
	var text='';
	
	function getToken () {
		var URL=window.location.href;
		var index1 = URL.indexOf("access_token=");
		if (index1==-1) {
			return showNone();
		} else {
			$("#auth").hide();
			
			var index2 = URL.indexOf("&expires_in");
			token= URL.substring(index1+13,index2);
			uid = URL.substring(URL.indexOf("user_id=")+8);
			getName();
			return getAlbums();
		};
	};

	function getUrl (method, params) {
		if (!token) throw new Error("Нет токена");
		if (!method) throw new Error("Нет метода");
		params=params||{};
		params['access_token']=token;
		return 'https://api.vk.com/method/'+method+'?'+$.param(params);
	};
	
	function sendRequest (method, params, func) {
		$.ajax({
			url: getUrl(method, params),
			method: "GET",
			dataType: "JSONP",
			success:func
		});
	};
	function getName () {
		sendRequest("users.get",{user_ids: uid}, function(data){
			var name;
			name="<h3>Welcome, "+data.response[0].first_name+" "+data.response[0].last_name+".</h3>";
			$("div#head").html(name);
		})
	};

	function getAlbums () {
		sendRequest("photos.getAlbums",{owner_id: uid,need_covers:1,need_system:1}, function(data){
			var list='';	
			for (var i=0; i<data.response.length;i++) {
				list +=
					"<li class='oneAlbum' onclick='getPhotos("+data.response[i].aid+",\""+data.response[i].title+"\")'>"
						+"<div class='album'>"
							+"<img class='thumb' src='"+data.response[i].thumb_src+"'/>"
							+"<div class='info'>"
								+"<h3>"+data.response[i].title+"</h3>"
								+"<p><img class='file' src='img/file.png'/>"+data.response[i].size+" files</p>"
							+"</div>"
						+"</div>"
						+"<img class='arrows' src='img/arrows-right.png'/>"
					+"</li>";
			}
			$("ul#albums").show();
			$("div#onePhoto").hide();
			$("div#photos").hide();
			$("ul#albums").html(list);
		});
	};
	
	function getPhotos (id,title) {
		sendRequest("photos.get",{owner_id: uid,need_system:1,album_id:id,rev:1}, function(data){
			console.log(data);
			var list='';
			var head = "<div onclick='back()'><img class='arrow' src='img/arrow-left.png'/><h3>"+title+"</h3></div>";
			$("div#head").html(head);
			for (var i=0; i<data.response.length;i++) {
				list +=
					"<div class='photoSmall' >"
						+"<img class='smallPhoto' src='"+data.response[i].src+"'/>"
						+"<p onclick='getOnePhoto(\""+data.response[i].text+"\",\""+data.response[i].src_big+"\",\""+title+"\")'><img class='check' src='img/check.png'/>Select</p>"
					+"</div>";
			}
			$("ul#albums").hide();
			$("div#onePhoto").hide();
			$("div#photos").show();
			$("div#photos").html(list);
		});
	};
	
	function getOnePhoto (text,src,title) {
			$("ul#albums").hide();
			$("div#onePhoto").show();
			$("div#photos").hide();
			var head = "<div onclick='back2(\""+title+"\")'><img class='arrow' src='img/arrow-left.png'/></button>";
			$("div#head").html(head);
			var body ="<div class='onePhoto'><img src='"+src+"'/>";
			if (text) {body+="<p><span>Caption:</span> "+text+"</p></div>";} else {body+="</div>";}
			$("div#onePhoto").html(body);			
	};
	
	function back () {
		getName();
		$("ul#albums").show();
		$("div#photos").hide();
	};
	
	function back2 (title) {
		$("div#onePhoto").hide();
		$("div#photos").show();
		var head = "<div onclick='back()'><img class='arrow' src='img/arrow-left.png'/><h3>"+title+"</h3></div>";
		$("div#head").html(head);
	};
	
	function showNone () {
		$("ul#albums").hide();
		$("div#onePhoto").hide();
		$("div#photos").hide();
	};
	
$(document).ready(getToken());