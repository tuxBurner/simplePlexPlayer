var MenuItem = function(obj, type, parentId) {
  this.id = obj.id;
  this.title = obj.title;
  this.type = type;
  this.displayCallBack = obj.displayCallBack;
  this.thumb = obj.thumb;
  this.parent = parentId;
}
