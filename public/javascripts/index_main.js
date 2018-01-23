  var dataip = "al.wtianyu.com:3010"
  var passwd = "kb%uFFFE.J%60%000Hg%07%3EKh%uFFFA+Oj%08AMr%009Ul%uFFFA-R"; //"gb%uFFFE.J%60%000Hg%07%3EK1";
  var isDragUploadFile = false; //是否是拖拽上传文件
  var sourcePath;
  var targetPath;
  var filePath;
  var doType;
  var doType_go = 2007;
  var reloadPath = window.location.href;
  var pathPre = window.location.href;
  //视频的正则识别
  var videoTypeReg = ".(mp4|avi|flv|3gp|rmvb)$";
  var audioTypeReg = ".(mp3|wav)$";
  //文档的正则识别
  var officeTypeReg = ".(doc|docx|ppt|pptx|xls|xlsx)$"

  //处理url多/的正则表达式
  var urlReg = "/[/]+";

  var isUsePasswd = true;
  var isLimitAsk = "%E4%B8%B4%E6%97%B6%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95"; //临时文件夹
  //用来计算上传速度
  var time;
  var upload_flush_count = 5; //上传速度刷新频率
  var upload_count = 0;

  var dragCount = 0;

  if (pathPre.indexOf("path=") > -1) {
      pathPre = pathPre.split("path=")[pathPre.split("path=").length - 1];
  } else {
      pathPre = "/";
  }
  document.getElementById("dirpath").value = decodeURIComponent(pathPre);
  var dataFolder = [
      [{
          text: "打开",
          func: function() {
              go(filePath);
          }
      }],
      [{
          text: "删除",
          func: function() {
              if (confirm("你确定要执行该删除操作吗？一旦执行，不可逆转")) {
                  doType = 1;
                  sourcePath = pathPre + encodeURIComponent("/" + filePath);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&doType=" + doType);
              } else {
                  return false;
              }
          }
      }],
      [{
          text: "移动",
          func: function() {
              doType = 2;
              openFolderDialog("移动");
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
          }
      }],
      [{
          text: "复制",
          func: function() {
              doType = 3;
              openFolderDialog("复制");
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
              console.log(sourcePath);
          }
      }],
      [{
          text: "重命名",
          func: function() {
              doType = 4;
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
              var newName = window.prompt("请输入新文件夹名", filePath);
              if ($.trim(newName).length < 1) {
                  return false;
              }
              if ($.trim(newName).length < 1 || $.trim(newName).indexOf(".") > -1 || $.trim(newName).indexOf("/") > -1) {
                  alert("请输入合法文件名");
                  return false;
              } else {
                  targetPath = pathPre + "/" + encodeURIComponent(newName);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&targetPath=" + targetPath + "&doType=" + doType);
              }
          }
      }],
      [{
          text: "zip压缩文件夹",
          func: function() {
              doType = 8;
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
              snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&targetPath=" + targetPath + "&doType=" + doType);
          }
      }],
      [{
          text: "取消",
          func: function() {}
      }]
  ];
  var dataFile = [
      [{
          text: "编辑",
          func: function() {
              if (isCanOpen(filePath)) {
                  preView(filePath);
              } else if (isImg(filePath)) {
                  document.getElementById(filePath).click()
              } else if (filePath.toLocaleLowerCase().match(new RegExp(videoTypeReg))) {
                  if (confirm("该文件为视频文件，是否进行播放")) {
                      //播放视频
                      var videoObj_li = document.getElementById(filePath);
                      videoObj_li.style.width = "150px";
                      videoObj_li.style.background = "#FFFFFF";
                      var videoSrc = "http://al.wtianyu.com:3010/filedownload?path=" + isPrettyPhoto(pathPre) + encodeURIComponent("/" + filePath);
                      videoObj_li.innerHTML = "<video width='150px' height='115px' title='" + filePath + "' ondblclick='playVideoFull(this)' controls='controls' src='" + videoSrc + "'  />"
                  }
              } else if (filePath.toLocaleLowerCase().match(new RegExp(audioTypeReg))) {
                  if (confirm("该文件为音频文件，是否进行播放")) {
                      //播放视频
                      var audioObj_li = document.getElementById(filePath);
                      audioObj_li.style.width = "100px";
                      audioObj_li.style.background = "#FFFFFF";
                      var audioSrc = "http://al.wtianyu.com:3010/filedownload?path=" + isPrettyPhoto(pathPre) + encodeURIComponent("/" + filePath);
                      audioObj_li.innerHTML = "<span style='position:absolute;padding:8px;font-size:12px;'>" + filePath + "</span><audio width='150px' height='115px' title='" + filePath + "' ondblclick='playVideoFull(this)' preload='preload' controls='controls' src='" + audioSrc + "'  />"
                  }
              } else {
                  alert("该文件类型不能进行编辑!!!");
              }
          }
      }],
      [{
          text: "下载",
          func: function() {
              downl(filePath);
          }
      }],
      [{
          text: "删除",
          func: function() {
              if (confirm("你确定要执行该删除操作吗？一旦执行，不可逆转")) {
                  doType = 1;
                  sourcePath = pathPre + encodeURIComponent("/" + filePath);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&doType=" + doType);
              } else {
                  return false;
              }
          }
      }],
      [{
          text: "移动",
          func: function() {
              doType = 2;
              openFolderDialog("移动");
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
          }
      }],
      [{
          text: "复制",
          func: function() {
              doType = 3;
              openFolderDialog("复制");
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
          }
      }],
      [{
          text: "重命名",
          func: function() {
              doType = 4;
              sourcePath = pathPre + encodeURIComponent("/" + filePath);
              var newName = prompt("请输入新文件名", filePath);
              if ($.trim(newName).length < 1) {
                  return false;
              }
              if ($.trim(newName).length < 1 || $.trim(newName).indexOf("/") > -1) {
                  alert("请输入合法文件名");
                  return false;
              } else {
                  targetPath = pathPre + "/" + encodeURIComponent(newName);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&targetPath=" + targetPath + "&doType=" + doType);
              }
          }
      }],
      [{
          text: "zip解压",
          func: function() {
              doType = 7;
              if (filePath.indexOf(".zip") > -1) {
                  sourcePath = pathPre + encodeURIComponent("/" + filePath);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&targetPath=" + targetPath + "&doType=" + doType);
              } else {
                  alert("该文件类型不能进行zip解压");
              }
          }
      }],
      [{
          text: "文件详情",
          func: function() {
              $("#fileDetial").dialog("open");
              $("#fileDetialContent").html(decodeURIComponent("http://" + dataip + "/filedownload?path=" + isPrettyPhoto(pathPre) + encodeURIComponent("/" + filePath)));
          }
      }],
      [{
          text: "取消",
          func: function() {}
      }]
  ];
  var dataHtml = [
      [{
          text: "上传",
          func: function() {
              openUploadDialog();
          }
      }],
      [{
          text: "刷新",
          func: function() {
              window.location.reload();
          }
      }],
      [{
          text: "跳转",
          func: function() {
              doType = doType_go; //代表执行跳转功能
              openFolderDialog("跳转");
              sourcePath = pathPre;
          }
      }],
      [{
          text: "新建文件",
          func: function() {
              doType = 5;
              var newName = prompt("请输入文件名");
              if ($.trim(newName).length < 1 || $.trim(newName).indexOf("/") > -1) {
                  alert("请输入合法文件名");
                  return false;
              } else {
                  targetPath = pathPre + "/" + encodeURIComponent(newName);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&targetPath=" + targetPath + "&doType=" + doType);
              }
          }
      }],
      [{
          text: "新建文件夹",
          func: function() {
              doType = 6;
              var newName = prompt("请输入新文件夹名");
              if ($.trim(newName).length < 1 || $.trim(newName).indexOf(".") > -1 || $.trim(newName).indexOf("/") > -1) {
                  alert("请输入合法文件夹名");
                  return false;
              } else {
                  targetPath = pathPre + "/" + encodeURIComponent(newName);
                  snedOperateShell("shellOperate?sourcePath=" + sourcePath + "&targetPath=" + targetPath + "&doType=" + doType);
              }
          }
      }],
      [{
          text: "内存使用情况",
          func: function() {
              openShellDialog();
              var xr = new XMLHttpRequest();
              xr.open("GET", "shellMemCondition");
              xr.onreadystatechange = function() {
                  if (xr.readyState == 4) {
                      if (xr.status == 200) {
                          document.getElementById("shellContent").innerText = xr.responseText;
                          document.getElementById("spinner").style.display = "none";
                      }
                  }
              }
              xr.send(null);
          }
      }],
      [{
          text: "搜索",
          func: function() {
              openSearchDialog();
          }
      }],
      [{
          text: "取消",
          func: function() {}
      }]
  ];
  var optionFile = {
      name: "menu1",
      offsetX: 0
  };
  var optionFolder = {
      name: "menu2",
      offsetX: 0
  };
  var optionHtml = {
      name: "menu3",
      offsetX: 0
  };
  $("#fileDiv").attr("cursor", "pointer");
  $("#fileDiv").smartMenu(dataFile, optionFile);
  $("#folderDiv").attr("cursor", "pointer");
  $("#folderDiv").smartMenu(dataFolder, optionFolder);
  $("html").smartMenu(dataHtml, optionHtml);

  function changeInPutSearchName() {
      var searchFlag = document.getElementById("searchFile").value;
      if (searchFlag == 1) {
          document.getElementById("searchNameIP").style.display = "";
          document.getElementById("searchNameTT").style.display = "none";
      } else if (searchFlag == 2) {
          document.getElementById("searchNameIP").style.display = "none";
          document.getElementById("searchNameTT").style.display = "";
      }
  }

  function mouserover(path) {
      filePath = path;
      //console.log(filePath);
  }

  //播放视频全屏
  function playVideoFull(obj) {
      var docElm = obj;
      //W3C
      if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
      }
  }

  function downlSearch(path) {
      if (isForbidAsk(path) || validatePasswd()) {
          window.location.href = "http://" + dataip + "/filedownload?path=" + encodeURIComponent(path);
      }
  }

  function validatePasswd() {
      if (sessionStorage.getItem("password") == passwd) {
          return true;
      }
      var pass = prompt("强制访问需要输入密码！！！");
      if (compile(pass) == passwd) {
          sessionStorage.setItem("password", compile(pass));
          return true;
      } else {
          alert("密码验证失败！！！");
          return false;
      }
  }

  function downl(path) {
      if (isForbidAsk(path) || validatePasswd()) {
          window.location.href = "http://" + dataip + "/filedownload?path=" + isPrettyPhoto(pathPre) + encodeURIComponent("/" + path);
      }
  }

  //编辑
  function preView(path) {
      // window.location.title = "文件编辑";
      // window.location.href = "http://"+dataip+"/fileView?path=" + pathPre + encodeURIComponent("/" + path);
      if (isForbidAsk(path) || validatePasswd()) {
          var completePath = "http://" + dataip + "/fileView?path=" + pathPre + encodeURIComponent("/" + path);
          console.log(path);
          if (path.toLocaleLowerCase().match(new RegExp(officeTypeReg))) {
              completePath = "http://" + dataip + "/filedownload?path=" + isPrettyPhoto(pathPre) + encodeURIComponent("/" + filePath);
              completePath = decodeURIComponent(completePath);
              console.log(completePath);
              window.open("https://view.officeapps.live.com/op/view.aspx?src=" + completePath);
          } else {
              var myWindow = window.open(completePath);
          }
      }
      // myWindow.document.title = "这里写个标题";
  }

  function go(path, flag) {
      path = path.replace(new RegExp(urlReg), "/");
      pathPre = pathPre.replace(new RegExp(urlReg), "/");
      if (isForbidAsk(path)) {
          if (flag == 2) { //去根目录
              window.location.href = "http://" + dataip + "/filelist?path=" + encodeURIComponent("/");
              return true;
          } else if (flag == 3) { //返回上级目录
              pathPre = replaceAll(pathPre, "%2F", "/");
              var pathPreIndex = pathPre.lastIndexOf("/");
              window.location.href = "http://" + dataip + "/filelist?path=" + decodeURIComponent("/" + pathPre.substring(0, pathPreIndex));
              return true;
          } else if (flag == 4) { //跳转
              window.location.href = "http://" + dataip + "/filelist?path=" + encodeURIComponent("/" + path);
              return true;
          }
          window.location.href = "http://" + dataip + "/filelist?path=" + isPrettyPhoto(pathPre) + encodeURIComponent("/" + path);
      }
  }

  //限制访问文件夹
  function isForbidAsk(path, isUsePathPre) {
      var pathTempDir2;
      if (isUsePathPre != 1) {
          pathTempDir2 = isPrettyPhoto(pathPre) + encodeURIComponent('/' + path);
      } else {
          pathTempDir2 = encodeURIComponent('/' + path);
      }
      pathTempDir2 = replaceAll(pathTempDir2, "/", "");
      pathTempDir2 = replaceAll(pathTempDir2, "%2F", "");
      if (pathTempDir2.substring(0, isLimitAsk.length) == isLimitAsk || sessionStorage.getItem("password") == passwd) {
          //允许访问
          return true;
      }
      alert("禁止访问非" + decodeURIComponent(isLimitAsk) + "!!!");
      return false;
  }

  /**
   * 完美实现字符全部替换功能
   * @param str 原完整字符串
   * @param sptr1 原字符
   * @param sptr2 替换字符
   * @returns {string} 替换后的字符串
   * 更新时间2017-8-2
   */
  function replaceAll(str, sptr1, sptr2) {
      var strTemp = "";
      var flag = 0;
      var length = 0;
      var begin = 0;
      if (str.indexOf(sptr1, flag + length) == -1) {
          return str;
      }
      while ((flag = str.indexOf(sptr1, flag)) > -1) {
          strTemp += str.substring(begin, flag) + sptr2;
          length = sptr2.length;
          begin = flag + sptr1.length;
          flag = flag + sptr1.length;
      }
      if (begin != 0) { //进行过截断
          strTemp += str.substring(begin, str.length);
      }
      return strTemp;
  }


  function showSearchFile(searchFiles) {
      $("#showSearchFileUL").html("");
      for (var i = 0; i < searchFiles.length - 1; i++) {
          var htmlTemp = '  <li class="file" title="单击下载" style="cursor: pointer;width:100%;height:auto;background:none;margin-left:0px ">' +
              '<a style="cursor: pointer;width:100%;height:auto;background:none;margin-left:0px;border:none "  title = "单击下载" href = "javascript:void(0)" onclick = "downlSearch(' + "'" + searchFiles[i] + "'" + ')" >' +
              searchFiles[i] + '</a> </li > ';
          $("#showSearchFileUL").append(htmlTemp);
      }
  }

  function snedOperateShell(url) {
      url = isPrettyPhoto(url);
      if (isForbidAsk(url) || validatePasswd()) {
          //向服务器发送移动命令
          var xr = new XMLHttpRequest();
          xr.open("GET", url);
          xr.onreadystatechange = function() {
              if (xr.readyState == 4) {
                  if (xr.status == 200) {
                      alert(xr.responseText);
                      window.location.href = reloadPath;
                  }
              }
          }
          xr.send(null);
      }
  }

  function isPrettyPhoto(url_prettyPhoto) {
      if (url_prettyPhoto.indexOf("#prettyPhoto") > -1) {
          return replaceAll(url_prettyPhoto, "#prettyPhoto", "");
      } else {
          return url_prettyPhoto;
      }
  }

  function openSearchDialog() {
      document.getElementById("spinnerSearch").style.display = "none";
      document.getElementById("searchDiv").style.display = "";
      $("#searchDialog").dialog("open");
  }

  function openFolderDialog(file_title) {
      $("#ui-id-5").html("请选择" + file_title + "目录");
      $("#chooseFolderDialog").dialog("open");
      //请求显示文件系统所有目录
      var xr = new XMLHttpRequest();
      xr.open("GET", "getFolderAll?path=" + pathPre);
      xr.onreadystatechange = function() {
          if (xr.readyState == 4) {
              if (xr.status == 200) {
                  initZtree(xr.responseText);
              }
          }
      }
      xr.send(null);
  }


  function openUploadDialog() {
      if (isForbidAsk(isPrettyPhoto(pathPre)) || validatePasswd()) {
          $("#uploadDialog").dialog("open");
      }
  }

  function openShellDialog() {
      document.getElementById("spinner").style.display = "";
      $("#shellDialog").dialog("open");
  }


  //上传文件配置
  function validate() {
      try {
          var obj_file = document.getElementById("uploadFile");
          if (obj_file.value == "") {
              alert("请先选择上传文件");
              return;
          }
          //            document.getElementById("upload_submitForm").submit();
          //            return false;
          var fd = new FormData();
          fd.append("uploadFile", document.getElementById('uploadFile').files[0]);
          fd.append("fileName", document.getElementById('uploadFile').files[0].name);
          fd.append("dirpath", document.getElementById('dirpath').value);
          var xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", uploadProgress, false);
          xhr.addEventListener("load", uploadComplete, false);
          xhr.addEventListener("error", uploadFailed, false);
          xhr.addEventListener("abort", uploadCanceled, false);
          xhr.open("POST", "uploadFile"); //修改成自己的接口
          xhr.setRequestHeader("context-type", "text/xml;charset=utf-8");
          xhr.send(fd);
      } catch (e) {
          alert(e);
      }
  }

  function uploadProgress(evt) {
      if (evt.lengthComputable) {
          var progress_loaded = document.getElementById('progressNumber').value; //已经加载的数据
          var percentComplete = evt.loaded * 100 / evt.total;
          document.getElementById("progress_span").innerHTML = percentComplete.toFixed(2) + "%";
          document.getElementById('progressNumber').style.display = "";
          document.getElementById('progressNumber').value = percentComplete;
          if (time == null) {
              time = evt.timeStamp;
          } else if ((++upload_count) % upload_flush_count == 0) {
              upload_count = 0;
              var timeDif = (evt.timeStamp - time) / 1000; //秒
              var loaded_data = ((percentComplete - progress_loaded) * evt.total / 100) / 1024; //kb
              //   console.log(loaded_data + "kb");
              //   console.log(timeDif + "s");
              //   console.log((loaded_data / timeDif).toFixed(2));
              var progressSpeed = (loaded_data / timeDif).toFixed(2);
              if (progressSpeed > 1024) {
                  document.getElementById("progressSpeed").innerHTML = (progressSpeed / 1024).toFixed(2) + "M/s";
              } else {
                  document.getElementById("progressSpeed").innerHTML = progressSpeed.toFixed(0) + "kb/s";
              }
          }
          console.log("正在上传" + percentComplete.toFixed(2) + "%");
          time = evt.timeStamp;
      } else {
          document.getElementById('progressNumber').innerHTML = 'unable to compute';
      }
  }

  function uploadComplete() {
      /* 服务器端返回响应时候触发event事件*/
      console.log("上传成功");
      document.getElementById('download').innerHTML = "上传成功,你可以继续上传文件";
      document.getElementById("upload_submitForm").reset();
      document.getElementById("fileName").innerHTML = "";
      document.getElementById("fileSize").innerHTML = "";
      document.getElementById("fileType").innerHTML = "";
      document.getElementById("progressSpeed").innerHTML = "";
      if (isDragUploadFile) {
          dragCount--;
          if (dragCount == 0) { //当最后一个文件也上传成功后，关闭窗口
              setTimeout(function() {
                  $("#uploadDialog").dialog("close");
                  window.location.reload();
              }, 1000);
          }
      }

  }

  function uploadFailed(evt) {
      alert("上传文件失败");
  }

  function uploadCanceled(evt) {
      alert("取消上传文件");
  }

  function initZtree(json) {
      console.log(json);
      var zTreeObj;
      var setting;
      setting = {
          callback: {
              onClick: clicTree,
              onCollapse: onCollapse,
              onExpand: onExpand
          },
          data: {
              simpleData: {
                  enable: true,
                  idKey: "id",
                  pIdKey: "pId",
                  rootPId: 0
              },
          }
      };
      var zNodes = JSON.parse(json);
      zTreeObj = $.fn.zTree.init($("#folderZtree"), setting, zNodes);
      var treeObj = $.fn.zTree.getZTreeObj("folderZtree");
      pathPre = replaceAll(pathPre, "%2F", "/");
      pathPre = pathPre.replace(new RegExp(urlReg), "/");
      pathPre = isPrettyPhoto(pathPre);
      console.log(decodeURIComponent(pathPre));
      var node = treeObj.getNodeByParam("id", decodeURIComponent(pathPre));
      treeObj.selectNode(node);
      treeObj.expandNode(node, true, false); //指定选中ID节点展开
      console.log(node);
  }

  function clicTree(event, treeId, treeNode) {
      targetPath = treeNode.id;
      console.log(treeNode);
  }

  function onCollapse() {

  }

  function onExpand(event, treeId, treeNode) {
      addNode(treeNode);
  }

  function addNode(treeNode) {
      //动态加载子节点
      var xr = new XMLHttpRequest();
      xr.open("GET", "getFolderNodes?path=" + encodeURIComponent(treeNode.id));
      xr.onreadystatechange = function() {
          if (xr.readyState == 4) {
              if (xr.status == 200) {
                  if (xr.responseText.length > 0) {
                      var treeObj = $.fn.zTree.getZTreeObj("folderZtree");
                      //判断原来子节点和新子节点是否相同，相同不刷新，不相同刷新
                      var beforeNodeChildren = treeObj.getNodesByParam("id", treeNode.id, null)[0].children;
                      var newNodeChildren = JSON.parse(xr.responseText);
                      var isEqual = true;
                      if (beforeNodeChildren != null && newNodeChildren.length == beforeNodeChildren.length && newNodeChildren.length > 0) {
                          for (var i = 0; i < newNodeChildren.length; i++) {
                              if (newNodeChildren[i].id != beforeNodeChildren[i].id) {
                                  isEqual = false;
                                  break;
                              }
                          }
                      } else {
                          isEqual = false;
                      }
                      if (!isEqual) {
                          treeObj.removeChildNodes(treeNode);
                          treeObj.expandNode(treeNode, false, false); //指定选中ID节点展开
                          treeObj.addNodes(treeNode, JSON.parse(xr.responseText));
                          treeObj.expandNode(treeNode, true, false); //指定选中ID节点展开
                      }
                  }
              }
          }
      }
      xr.send(null);
  }


  function chageIconFile() {
      $("[name='file_a']").each(function() {

          var filename_a = $(this).text().trim();
          //.doc和.docx的图标变更
          if ((filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".doc") ||
              (filename_a.length > 5 && filename_a.substring(filename_a.length - 5, filename_a.length).toLocaleLowerCase() == ".docx")) {
              $(this).parent().css("background", "url(/images/word.png) center top no-repeat");
          }
          //.ppt和.pptx的图标变更
          else if ((filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".ppt") ||
              (filename_a.length > 5 && filename_a.substring(filename_a.length - 5, filename_a.length).toLocaleLowerCase() == ".pptx")) {
              $(this).parent().css("background", "url(/images/ppt.png) center top no-repeat");
          }
          //.xls和.xlsx的图标变更
          else if ((filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".xls") ||
              (filename_a.length > 5 && filename_a.substring(filename_a.length - 5, filename_a.length).toLocaleLowerCase() == ".xlsx")) {
              $(this).parent().css("background", "url(/images/xlsx.png) center top no-repeat");
          }
          //.zip和.rar、.7z的图标变更
          else if ((filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".zip") ||
              (filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".rar") ||
              (filename_a.length > 3 && filename_a.substring(filename_a.length - 3, filename_a.length).toLocaleLowerCase() == ".7z")) {
              $(this).parent().css("background", "url(/images/zip.png) center top no-repeat");
          }
          //.txt的图标变更
          else if ((filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".txt")) {
              $(this).parent().css("background", "url(/images/txt.png) center top no-repeat");
          }
          //.htm和.html的图标变更
          else if ((filename_a.length > 4 && filename_a.substring(filename_a.length - 4, filename_a.length).toLocaleLowerCase() == ".htm") ||
              (filename_a.length > 5 && filename_a.substring(filename_a.length - 5, filename_a.length).toLocaleLowerCase() == ".html")) {
              $(this).parent().css("background", "url(/images/html.png) center top no-repeat");
          }
          //video图标变更
          else if (filename_a.toLocaleLowerCase().match(new RegExp(videoTypeReg))) {
              $(this).parent().css("background", "url(/images/video.jpg) center top no-repeat");
          }
          //audio图标变更
          else if (filename_a.toLocaleLowerCase().match(new RegExp(audioTypeReg))) {
              $(this).parent().css("background", "url(/images/audio.jpg) center top no-repeat");
          }
      });
  }

  function uploadFileDrag(fileDrag) {
      dragCount++;
      console.log("拖拽上传" + fileDrag.name + "文件,大小" + parseInt(fileDrag.size / 1024) + "kb");
      document.getElementById('fileName').innerHTML = 'Name: ' + fileDrag.name;
      document.getElementById('fileSize').innerHTML = 'Size: ' + parseInt(fileDrag.size / 1024) + "kb";
      document.getElementById('fileType').innerHTML = 'Type: ' + fileDrag.type;
      var fd = new FormData();
      fd.append("uploadFile", fileDrag);
      fd.append("fileName", fileDrag.name);
      fd.append("dirpath", isPrettyPhoto(document.getElementById('dirpath').value));
      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      xhr.open("POST", "uploadFile"); //修改成自己的接口
      xhr.setRequestHeader("context-type", "text/xml;charset=utf-8");
      xhr.send(fd);
  }

  function showDragImg(fileListDrag) {
      //检测文件是不是图片 
      if (fileListDrag[0].type.indexOf('image') === -1) {
          alert("您拖的不是图片！");
          return false;
      }
      //拖拉图片到浏览器，可以实现预览功能
      var img = window.URL.createObjectURL(fileListDrag[0]);
      var filename = fileListDrag[0].name; //图片名称
      var filesize = Math.floor((fileListDrag[0].size) / 1024);
      if (filesize > 500) {
          alert("上传大小不能超过500K.");
          return false;
      }
      //alert(filesize);
      var str = "<img src='" + img + "'><p>图片名称：" + filename + "</p><p>大小：" + filesize + "KB</p>";
      $("#body_div").html(str);
  }

  //简单的加密方法
  function compile(code) {
      var c = String.fromCharCode(code.charCodeAt(0) * 2 + code.length - 1);
      for (var i = 1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
          c += String.fromCharCode(code.charCodeAt(i) - code.charCodeAt(i - 1));
          c += String.fromCharCode(code.charCodeAt(i) * 2 - code.charCodeAt(i - 1));
          c += String.fromCharCode(code.charCodeAt(i) / 2 + code.charCodeAt(i - 1));
      }
      return escape(c);
  }