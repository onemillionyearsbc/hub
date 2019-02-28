function Truncate(obj) {
	this.className = obj.className;
	this.char = obj.char || 150;
	this.numOfTruncateBy = obj.numOfTruncateBy || 3;
	this.truncateBy = obj.truncateBy || ".";
	let paragraphTag = document.getElementsByClassName(this.className); 
	for(let i=0;i<paragraphTag.length;i++){				
		var paragraph = paragraphTag[i].innerHTML;
		if(paragraph.length > this.char){
			var truncate = '';				
			if(typeof(paragraph) === 'string'){
				for(let j=0;j<this.char;j++){
					truncate = truncate + paragraph.charAt(j);
				}
				for(let k=0;k<this.numOfTruncateBy;k++){
					truncate = truncate + this.truncateBy;
				}						
			}
			paragraphTag[i].innerHTML = truncate;
		}		
	}		
}