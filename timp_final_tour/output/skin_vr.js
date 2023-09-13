// Garden Gnome Software - VR - Skin
// Pano2VR 7.0.6/20004
// Filename: venis_vr.ggsk
// Generated 2023-09-12T10:29:55

function pano2vrVrSkin(player,base) {
	player.addVariable('node_cloner_vr_hasUp', 2, false, { ignoreInState: 0  });
	player.addVariable('node_cloner_vr_hasDown', 2, false, { ignoreInState: 0  });
	player.addVariable('vis_info_hotspots', 0, "", { ignoreInState: 0  });
	player.addVariable('vis_image_hotspots', 0, "", { ignoreInState: 0  });
	player.addVariable('vis_video_file_hotspots', 0, "", { ignoreInState: 0  });
	player.addVariable('vis_video_url_hotspots', 0, "", { ignoreInState: 0  });
	var me=this;
	var skin=this;
	var flag=false;
	var vrSkinAdded=false;
	var hotspotTemplates={};
	var skinKeyPressed = 0;
	this.player=player;
	this.player.vrSkinObj=this;
	this.ggUserdata=player.userdata;
	this.lastSize={ w: -1,h: -1 };
	var basePath="";
	// auto detect base path
	if (base=='?') {
		var scripts = document.getElementsByTagName('script');
		for(var i=0;i<scripts.length;i++) {
			var src=scripts[i].src;
			if (src.indexOf('skin.js')>=0) {
				var p=src.lastIndexOf('/');
				if (p>=0) {
					basePath=src.substr(0,p+1);
				}
			}
		}
	} else
	if (base) {
		basePath=base;
	}
	this.elementMouseDown={};
	this.elementMouseOver={};
	var i;
	var hs,el,els,elo,ela,geometry,material;
	player.setMargins(0,0,0,0);
	
	this.findElements=function(id,regex) {
		var r=[];
		var stack=[];
		var pat=new RegExp(id,'');
		stack.push(me.skinGroup);
		while(stack.length>0) {
			var e=stack.pop();
			if (regex) {
				if (pat.test(e.userData.ggId)) r.push(e);
			} else {
				if (e.userData.ggId==id) r.push(e);
			}
			if (e.children.length > 0) {
				for(var i=0;i<e.children.length;i++) {
					stack.push(e.children[i]);
				}
			}
		}
		return r;
	}
	
	this.posInSkin=function(el, clonerParent) {
		var curParent = el.parent;
		var pos = {x: el.position.x, y: el.position.y};
		while (curParent && curParent != me.skinGroup) {
			pos.x += curParent.position.x;
			pos.y += curParent.position.y;
			if (curParent.parent) {
				curParent = curParent.parent;
			} else {
				curParent = clonerParent
			}
		}
		return pos;
	}
	
	this._=function(text, params) {
		return player._(text, params);
	}
	this.languageChanged=function() {
		if (!me.skinGroup) return;
		var stack=[];
		stack.push(me.skinGroup);
		while(stack.length>0) {
			var e=stack.pop();
			if (e.userData && e.userData.ggUpdateText) {
				e.userData.ggUpdateText();
			}
			for(var i=0;i<e.children.length;i++) {
				stack.push(e.children[i]);
			}
		}
	}
	player.addListener('languagechanged', this.languageChanged);
	this.getElementVrPosition = function(el, x, y) {
		var vrPos = {};
		var renderableEl = (el.parent.type == 'Mesh' || el.parent.type == 'Group');
		switch (el.userData.hanchor) {
			case 0:
			vrPos.x = (renderableEl ? el.parent.position.x : 0) - ((renderableEl ? el.parent.userData.width : 800) / 200.0) + (x / 100.0) + (el.userData.width / 200.0);
			break;
			case 1:
			vrPos.x = (renderableEl ? el.parent.position.x : 0) + (x / 100.0);
			break;
			case 2:
			vrPos.x = (renderableEl ? el.parent.position.x : 0) + ((renderableEl ? el.parent.userData.width : 800) / 200.0) - (x / 100.0) - (el.userData.width / 200.0);
			break;
		}
		switch (el.userData.vanchor) {
			case 0:
			vrPos.y = (renderableEl ? el.parent.position.y : 0) + ((renderableEl ? el.parent.userData.height : 600) / 200.0) - (y / 100.0) - (el.userData.height / 200.0);
			break;
			case 1:
			vrPos.y = (renderableEl ? el.parent.position.y : 0) - (y / 100.0);
			break;
			case 2:
			vrPos.y = (renderableEl ? el.parent.position.y : 0) - ((renderableEl ? el.parent.userData.height : 600) / 200.0) + (y / 100.0) + (el.userData.height / 200.0);
			break;
		}
		vrPos.x += el.userData.curScaleOffX;
		vrPos.y += el.userData.curScaleOffY;
		return vrPos;
	}
	this.addSkin=function() {
		if (me.vrSkinAdded) return;
		me.vrSkinAdded = true;
		var hs='';
		this.ggCurrentTime=new Date().getTime();
		this.skinGroup=player.getSkinGroup();
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 250;
		el.userData.height = 500;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'thumbnails';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._thumbnails.material) me._thumbnails.material.opacity = v;
			me._thumbnails.visible = (v>0 && me._thumbnails.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._thumbnails.visible
			let parentEl = me._thumbnails.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._thumbnails.userData.opacity = v;
			v = v * me._thumbnails.userData.parentOpacity;
			me._thumbnails.userData.setOpacityInternal(v);
			for (let i = 0; i < me._thumbnails.children.length; i++) {
				let child = me._thumbnails.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._thumbnails.userData.parentOpacity = v;
			v = v * me._thumbnails.userData.opacity
			me._thumbnails.userData.setOpacityInternal(v);
			for (let i = 0; i < me._thumbnails.children.length; i++) {
				let child = me._thumbnails.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._thumbnails = el;
		el.userData.ggId="thumbnails";
		me._thumbnails.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.translateX(0);
		el.translateY(2.33);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 250;
		el.userData.height = 34;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'node_cloner_vr';
		el.userData.x = 0;
		el.userData.y = 2.33;
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._node_cloner_vr.material) me._node_cloner_vr.material.opacity = v;
			me._node_cloner_vr.visible = (v>0 && me._node_cloner_vr.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._node_cloner_vr.visible
			let parentEl = me._node_cloner_vr.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._node_cloner_vr.userData.opacity = v;
			v = v * me._node_cloner_vr.userData.parentOpacity;
			me._node_cloner_vr.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_cloner_vr.children.length; i++) {
				let child = me._node_cloner_vr.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._node_cloner_vr.userData.parentOpacity = v;
			v = v * me._node_cloner_vr.userData.opacity
			me._node_cloner_vr.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_cloner_vr.children.length; i++) {
				let child = me._node_cloner_vr.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._node_cloner_vr = el;
		el.userData.ggNumRepeat = 100;
		el.userData.ggCloneOffset = 0;
		el.userData.ggNumRows = 0;
		el.userData.ggNumCols = 0;
		el.userData.ggUpdating = false;
		el.userData.ggFilter = [];
		el.userData.ggInstances = [];
		el.userData.ggGoUp = function() {
			if (me._node_cloner_vr.userData.ggCloneOffset + me._node_cloner_vr.userData.ggNumRows <= me._node_cloner_vr.userData.ggNumFilterPassed) {
				me._node_cloner_vr.userData.ggCloneOffset += me._node_cloner_vr.userData.ggNumRows;
				me._node_cloner_vr.userData.ggCloneOffsetChanged = true;
				me._node_cloner_vr.userData.ggUpdate();
			}
		}
		el.userData.ggGoDown = function() {
			if (me._node_cloner_vr.userData.ggCloneOffset > 0) {
				me._node_cloner_vr.userData.ggCloneOffset -= me._node_cloner_vr.userData.ggNumRows;
				me._node_cloner_vr.userData.ggCloneOffset = Math.max(me._node_cloner_vr.userData.ggCloneOffset, 0);
				me._node_cloner_vr.userData.ggCloneOffsetChanged = true;
				me._node_cloner_vr.userData.ggUpdate();
			}
		}
		el.getFilteredNodes = function(tourNodes, filter) {
			var filteredNodes = [];
			for (var i = 0; i < tourNodes.length; i++) {
				var nodeId = tourNodes[i];
				var passed = true;
				var nodeData = player.getNodeUserdata(nodeId);
				if (filter.length > 0) {
					for (var j=0; j < filter.length; j++) {
						if (nodeData['tags'].indexOf(filter[j].trim()) == -1) passed = false;
					}
				}
				if (passed) {
					filteredNodes.push(nodeId);
				}
			}
			return filteredNodes;
		}
		el.userData.ggUpdate = function(filter) {
			if(me._node_cloner_vr.userData.ggUpdating == true) return;
			me._node_cloner_vr.userData.ggUpdating = true;
			var el=me._node_cloner_vr;
			var curNumRows = 0;
			var parentHeight = me._node_cloner_vr.parent.userData.height;
			me._node_cloner_vr.userData.offsetTop = (me._node_cloner_vr.parent.userData.height / 200.0) + me._node_cloner_vr.userData.y - (me._node_cloner_vr.userData.height / 200.0);
			curNumRows = Math.floor(((parentHeight - me._node_cloner_vr.userData.offsetTop) * me._node_cloner_vr.userData.ggNumRepeat / 100.0) / me._node_cloner_vr.userData.height);
			if (curNumRows < 1) curNumRows = 1;
			if (typeof filter=='object') {
				el.userData.ggFilter = filter;
			} else {
				filter = el.userData.ggFilter;
			};
			if (me.ggTag) filter.push(me.ggTag);
			filter=filter.sort();
			if ((el.userData.ggNumRows == curNumRows) && (el.userData.ggInstances.length > 0) && (filter.length === el.userData.ggCurrentFilter.length) && (filter.every(function(value, index) { return value === el.userData.ggCurrentFilter[index] }) ) && (!me._node_cloner_vr.userData.ggCloneOffsetChanged)) {
				me._node_cloner_vr.userData.ggUpdating = false;
				return;
			} else {
				el.userData.ggNumCols = 1;
				el.userData.ggNumRows = curNumRows;
			var centerOffsetHor = 0;
			var centerOffsetVert = 0;
				me._node_cloner_vr.userData.ggCloneOffsetChanged = false;
			}
			el.userData.ggCurrentFilter = filter;
			el.userData.ggInstances = [];
			el.remove(...el.children);
			var tourNodes = player.getNodeIds();
			var row = 0;
			var column = 0;
			var currentIndex = 0;
			var keepCloning = true;
			me._node_cloner_vr.userData.ggNumFilterPassed = 0;
			tourNodes = me._node_cloner_vr.getFilteredNodes(tourNodes, filter);
			me._node_cloner_vr.userData.ggNumFilterPassed = tourNodes.length;
			for (var i = 0; i < tourNodes.length; i++) {
				var nodeId = tourNodes[i];
				var nodeData = player.getNodeUserdata(nodeId);
				if (!keepCloning || i < me._node_cloner_vr.userData.ggCloneOffset) continue;
				var parameter={};
				parameter.top = -(centerOffsetVert / 100.0) - (row * me._node_cloner_vr.userData.height) / 100.0;
				parameter.left = (centerOffsetHor / 100.0) + (column * me._node_cloner_vr.userData.width) / 100.0;
				parameter.index=currentIndex;
				parameter.title=nodeData['title'];
				var inst = new SkinCloner_node_cloner_vr_Class(nodeId, me, el, parameter);
				currentIndex++;
				el.userData.ggInstances.push(inst);
				var bbox = new THREE.Box3().setFromObject(inst.__obj);
				var clonerPosInSkin = skin.posInSkin(me._node_cloner_vr, me.ggParent);
				if (bbox.min.x + clonerPosInSkin.x >= -4 && bbox.max.x + clonerPosInSkin.x <= 4 && bbox.min.y + clonerPosInSkin.y >= -3 && bbox.max.y + clonerPosInSkin.y <= 3) el.add(inst.__obj);
				row++;
				if (row >= el.userData.ggNumRows) {
					keepCloning = false;
				}
			}
			player.setVariableValue('node_cloner_vr_hasDown', me._node_cloner_vr.userData.ggCloneOffset > 0);
			player.setVariableValue('node_cloner_vr_hasUp', me._node_cloner_vr.userData.ggCloneOffset + me._node_cloner_vr.userData.ggNumRows < me._node_cloner_vr.userData.ggNumFilterPassed);
			me._node_cloner_vr.userData.ggNodeCount = me._node_cloner_vr.userData.ggNumFilterPassed;
			me._node_cloner_vr.userData.ggUpdating = false;
			player.triggerEvent('clonerchanged');
		}
		el.userData.ggFilter = [];
		el.userData.ggId="node_cloner_vr";
		me._node_cloner_vr.userData.ggUpdatePosition=function (useTransition) {
		}
		me._thumbnails.add(me._node_cloner_vr);
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'page_up_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'page_up_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(1.525);
		el.translateY(1.825);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'page_up';
		el.userData.x = 1.525;
		el.userData.y = 1.825;
		el.userData.hanchor = 2;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._page_up.material) me._page_up.material.opacity = v;
			me._page_up.visible = (v>0 && me._page_up.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._page_up.visible
			let parentEl = me._page_up.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._page_up.userData.opacity = v;
			v = v * me._page_up.userData.parentOpacity;
			me._page_up.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_up.children.length; i++) {
				let child = me._page_up.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._page_up.userData.parentOpacity = v;
			v = v * me._page_up.userData.opacity
			me._page_up.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_up.children.length; i++) {
				let child = me._page_up.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._page_up = el;
		el.userData.ggId="page_up";
		me._page_up.logicBlock_position = function() {
			var newLogicStatePosition;
			if (
				((player.getVariableValue('node_cloner_vr_hasDown') == false))
			)
			{
				newLogicStatePosition = 0;
			}
			else {
				newLogicStatePosition = -1;
			}
			if (me._page_up.ggCurrentLogicStatePosition != newLogicStatePosition) {
				me._page_up.ggCurrentLogicStatePosition = newLogicStatePosition;
				if (me._page_up.ggCurrentLogicStatePosition == 0) {
					var newPos = skin.getElementVrPosition(me._page_up, -50, 0);
					me._page_up.position.x = newPos.x;
					me._page_up.position.y = newPos.y;
				}
				else {
					var elPos = skin.getElementVrPosition(me._page_up, -50, 45);
					me._page_up.position.x = elPos.x;
					me._page_up.position.y = elPos.y;
				}
			}
		}
		me._page_up.logicBlock_position();
		me._page_up.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['page_up'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._page_up.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._page_up.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._page_up.ggCurrentLogicStateScaling == 0) {
					me._page_up.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._page_up.userData.transitions.length; i++) {
						if (me._page_up.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_up.userData.transitions[i].interval);
							me._page_up.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._page_up.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._page_up.scale.set(transition_scale.startScale.x + (me._page_up.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_up.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._page_up.position.x = (me._page_up.position.x - me._page_up.userData.curScaleOffX) + scaleOffX;
						me._page_up.userData.curScaleOffX = scaleOffX;
						me._page_up.position.y = (me._page_up.position.y - me._page_up.userData.curScaleOffY) + scaleOffY;
						me._page_up.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._page_up.userData.transitions.splice(me._page_up.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._page_up.userData.transitions.push(transition_scale);
				}
				else {
					me._page_up.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._page_up.userData.transitions.length; i++) {
						if (me._page_up.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_up.userData.transitions[i].interval);
							me._page_up.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._page_up.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._page_up.scale.set(transition_scale.startScale.x + (me._page_up.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_up.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._page_up.position.x = (me._page_up.position.x - me._page_up.userData.curScaleOffX) + scaleOffX;
						me._page_up.userData.curScaleOffX = scaleOffX;
						me._page_up.position.y = (me._page_up.position.y - me._page_up.userData.curScaleOffY) + scaleOffY;
						me._page_up.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._page_up.userData.transitions.splice(me._page_up.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._page_up.userData.transitions.push(transition_scale);
				}
			}
		}
		me._page_up.logicBlock_scaling();
		me._page_up.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('node_cloner_vr_hasUp') == true))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._page_up.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._page_up.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._page_up.ggCurrentLogicStateVisible == 0) {
			me._page_up.visible=((!me._page_up.material && Number(me._page_up.userData.opacity>0)) || Number(me._page_up.material.opacity)>0)?true:false;
			me._page_up.userData.visible=true;
				}
				else {
			me._page_up.visible=false;
			me._page_up.userData.visible=false;
				}
			}
		}
		me._page_up.logicBlock_visible();
		me._page_up.userData.onclick=function (e) {
			skin.findElements('node_cloner_vr')[0].userData.ggGoUp();
		}
		me._page_up.userData.onmouseover=function (e) {
			me.elementMouseOver['page_up']=true;
			me._page_up.logicBlock_scaling();
		}
		me._page_up.userData.ontouchend=function (e) {
			me._page_up.logicBlock_scaling();
		}
		me._page_up.userData.onmouseout=function (e) {
			me.elementMouseOver['page_up']=false;
			me._page_up.logicBlock_scaling();
		}
		me._page_up.ggCurrentLogicStatePosition = -1;
		me._page_up.ggCurrentLogicStateScaling = -1;
		me._page_up.ggCurrentLogicStateVisible = -1;
		me._page_up.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['page_up']) {
				me.elementMouseOver['page_up']=true;
			}
		}
		me._page_up.userData.ggUpdatePosition=function (useTransition) {
		}
		me._thumbnails.add(me._page_up);
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'page_down_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'page_down_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(1.525);
		el.translateY(2.275);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'page_down';
		el.userData.x = 1.525;
		el.userData.y = 2.275;
		el.userData.hanchor = 2;
		el.userData.vanchor = 0;
		el.translateZ(0.040);
		el.renderOrder = 4;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._page_down.material) me._page_down.material.opacity = v;
			me._page_down.visible = (v>0 && me._page_down.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._page_down.visible
			let parentEl = me._page_down.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._page_down.userData.opacity = v;
			v = v * me._page_down.userData.parentOpacity;
			me._page_down.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_down.children.length; i++) {
				let child = me._page_down.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._page_down.userData.parentOpacity = v;
			v = v * me._page_down.userData.opacity
			me._page_down.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_down.children.length; i++) {
				let child = me._page_down.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._page_down = el;
		el.userData.ggId="page_down";
		me._page_down.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['page_down'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._page_down.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._page_down.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._page_down.ggCurrentLogicStateScaling == 0) {
					me._page_down.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._page_down.userData.transitions.length; i++) {
						if (me._page_down.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_down.userData.transitions[i].interval);
							me._page_down.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._page_down.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._page_down.scale.set(transition_scale.startScale.x + (me._page_down.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_down.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._page_down.position.x = (me._page_down.position.x - me._page_down.userData.curScaleOffX) + scaleOffX;
						me._page_down.userData.curScaleOffX = scaleOffX;
						me._page_down.position.y = (me._page_down.position.y - me._page_down.userData.curScaleOffY) + scaleOffY;
						me._page_down.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._page_down.userData.transitions.splice(me._page_down.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._page_down.userData.transitions.push(transition_scale);
				}
				else {
					me._page_down.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._page_down.userData.transitions.length; i++) {
						if (me._page_down.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_down.userData.transitions[i].interval);
							me._page_down.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._page_down.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._page_down.scale.set(transition_scale.startScale.x + (me._page_down.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_down.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._page_down.position.x = (me._page_down.position.x - me._page_down.userData.curScaleOffX) + scaleOffX;
						me._page_down.userData.curScaleOffX = scaleOffX;
						me._page_down.position.y = (me._page_down.position.y - me._page_down.userData.curScaleOffY) + scaleOffY;
						me._page_down.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._page_down.userData.transitions.splice(me._page_down.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._page_down.userData.transitions.push(transition_scale);
				}
			}
		}
		me._page_down.logicBlock_scaling();
		me._page_down.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('node_cloner_vr_hasDown') == true))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._page_down.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._page_down.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._page_down.ggCurrentLogicStateVisible == 0) {
			me._page_down.visible=((!me._page_down.material && Number(me._page_down.userData.opacity>0)) || Number(me._page_down.material.opacity)>0)?true:false;
			me._page_down.userData.visible=true;
				}
				else {
			me._page_down.visible=false;
			me._page_down.userData.visible=false;
				}
			}
		}
		me._page_down.logicBlock_visible();
		me._page_down.userData.onclick=function (e) {
			skin.findElements('node_cloner_vr')[0].userData.ggGoDown();
		}
		me._page_down.userData.onmouseover=function (e) {
			me.elementMouseOver['page_down']=true;
			me._page_down.logicBlock_scaling();
		}
		me._page_down.userData.ontouchend=function (e) {
			me._page_down.logicBlock_scaling();
		}
		me._page_down.userData.onmouseout=function (e) {
			me.elementMouseOver['page_down']=false;
			me._page_down.logicBlock_scaling();
		}
		me._page_down.ggCurrentLogicStateScaling = -1;
		me._page_down.ggCurrentLogicStateVisible = -1;
		me._page_down.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['page_down']) {
				me.elementMouseOver['page_down']=true;
			}
		}
		me._page_down.userData.ggUpdatePosition=function (useTransition) {
		}
		me._thumbnails.add(me._page_down);
		me.skinGroup.add(me._thumbnails);
		me._thumbnails.userData.setOpacity(1.00);
		me._node_cloner_vr.userData.setOpacity(1.00);
		me._node_cloner_vr.userData.ggUpdate();
		me._page_up.logicBlock_position();
		me._page_up.logicBlock_scaling();
		me._page_up.logicBlock_visible();
		me._page_up.userData.setOpacity(1.00);
		me._page_down.logicBlock_scaling();
		me._page_down.logicBlock_visible();
		me._page_down.userData.setOpacity(1.00);
		player.addListener('activehotspotchanged', function() {
			if (hotspotTemplates.hasOwnProperty('ht_info')) {
				for(var i = 0; i < hotspotTemplates['ht_info'].length; i++) {
					hotspotTemplates['ht_info'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_image')) {
				for(var i = 0; i < hotspotTemplates['ht_image'].length; i++) {
					hotspotTemplates['ht_image'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_node')) {
				for(var i = 0; i < hotspotTemplates['ht_node'].length; i++) {
					hotspotTemplates['ht_node'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_file')) {
				for(var i = 0; i < hotspotTemplates['ht_video_file'].length; i++) {
					hotspotTemplates['ht_video_file'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_url')) {
				for(var i = 0; i < hotspotTemplates['ht_video_url'].length; i++) {
					hotspotTemplates['ht_video_url'][i].ggEvent_activehotspotchanged();
				}
			}
		});
		player.addListener('changenode', function() {
			if (hotspotTemplates.hasOwnProperty('ht_info')) {
				for(var i = 0; i < hotspotTemplates['ht_info'].length; i++) {
					hotspotTemplates['ht_info'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_image')) {
				for(var i = 0; i < hotspotTemplates['ht_image'].length; i++) {
					hotspotTemplates['ht_image'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_node')) {
				for(var i = 0; i < hotspotTemplates['ht_node'].length; i++) {
					hotspotTemplates['ht_node'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_file')) {
				for(var i = 0; i < hotspotTemplates['ht_video_file'].length; i++) {
					hotspotTemplates['ht_video_file'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_url')) {
				for(var i = 0; i < hotspotTemplates['ht_video_url'].length; i++) {
					hotspotTemplates['ht_video_url'][i].ggEvent_changenode();
				}
			}
			me._page_up.logicBlock_position();
			me._page_up.logicBlock_visible();
			me._page_down.logicBlock_visible();
		});
		player.addListener('configloaded', function() {
			if (hotspotTemplates.hasOwnProperty('ht_info')) {
				for(var i = 0; i < hotspotTemplates['ht_info'].length; i++) {
					hotspotTemplates['ht_info'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_image')) {
				for(var i = 0; i < hotspotTemplates['ht_image'].length; i++) {
					hotspotTemplates['ht_image'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_node')) {
				for(var i = 0; i < hotspotTemplates['ht_node'].length; i++) {
					hotspotTemplates['ht_node'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_file')) {
				for(var i = 0; i < hotspotTemplates['ht_video_file'].length; i++) {
					hotspotTemplates['ht_video_file'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_url')) {
				for(var i = 0; i < hotspotTemplates['ht_video_url'].length; i++) {
					hotspotTemplates['ht_video_url'][i].ggEvent_configloaded();
				}
			}
			me._page_up.logicBlock_position();
			me._page_up.logicBlock_visible();
			me._page_down.logicBlock_visible();
		});
		player.addListener('varchanged_node_cloner_vr_hasDown', function() {
			me._page_up.logicBlock_position();
			me._page_down.logicBlock_visible();
		});
		player.addListener('varchanged_node_cloner_vr_hasUp', function() {
			me._page_up.logicBlock_visible();
		});
		player.addListener('varchanged_vis_image_hotspots', function() {
			if (hotspotTemplates.hasOwnProperty('ht_image')) {
				for(var i = 0; i < hotspotTemplates['ht_image'].length; i++) {
					hotspotTemplates['ht_image'][i].ggEvent_varchanged_vis_image_hotspots();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_node')) {
				for(var i = 0; i < hotspotTemplates['ht_node'].length; i++) {
					hotspotTemplates['ht_node'][i].ggEvent_varchanged_vis_image_hotspots();
				}
			}
		});
		player.addListener('varchanged_vis_info_hotspots', function() {
			if (hotspotTemplates.hasOwnProperty('ht_info')) {
				for(var i = 0; i < hotspotTemplates['ht_info'].length; i++) {
					hotspotTemplates['ht_info'][i].ggEvent_varchanged_vis_info_hotspots();
				}
			}
		});
		player.addListener('varchanged_vis_video_file_hotspots', function() {
			if (hotspotTemplates.hasOwnProperty('ht_video_file')) {
				for(var i = 0; i < hotspotTemplates['ht_video_file'].length; i++) {
					hotspotTemplates['ht_video_file'][i].ggEvent_varchanged_vis_video_file_hotspots();
				}
			}
			if (hotspotTemplates.hasOwnProperty('ht_video_url')) {
				for(var i = 0; i < hotspotTemplates['ht_video_url'].length; i++) {
					hotspotTemplates['ht_video_url'][i].ggEvent_varchanged_vis_video_file_hotspots();
				}
			}
		});
		player.addListener('varchanged_vis_video_url_hotspots', function() {
			if (hotspotTemplates.hasOwnProperty('ht_video_url')) {
				for(var i = 0; i < hotspotTemplates['ht_video_url'].length; i++) {
					hotspotTemplates['ht_video_url'][i].ggEvent_varchanged_vis_video_url_hotspots();
				}
			}
		});
	};
	this.removeSkin=function() {
	};
	function SkinCloner_node_cloner_vr_Class(nodeId, parentScope, ggParent, parameter) {
		var me=this;
		me.parentScope=parentScope;
		me.ggParent=ggParent;
		me.findElements=skin.findElements;
		me.ggIndex=parameter.index;
		me.ggNodeId=nodeId;
		me.ggTitle=parameter.title;
		me.ggUserdata=skin.player.getNodeUserdata(me.ggNodeId);
		me.ggUserdata.nodeId=me.ggNodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
			me.__obj = new THREE.Group;
			me.__obj.name = 'node_cloner_vr_subElement';
			me.__obj.position.x = parameter.left;
			me.__obj.position.y = parameter.top;
			me.__obj.userData.ggIsActive = function() {
				return player.getCurrentNode()==me.userData.ggNodeId;
			}
			me.__obj.userData.ggElementNodeId=function() {
				return me.userData.ggNodeId;
			}
		geometry = new THREE.PlaneBufferGeometry(2.5, 0.32, 5, 5 );
		geometry.name = 'node_title_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'node_title_material';
		el = new THREE.Mesh( geometry, material );
		width = 2.5;
		height = 0.32;
		borderShape = new THREE.Shape();
		borderShape.moveTo((width / 2.0) - 0 + 0, (height / 2.0) + 0);
		borderShape.lineTo((width / 2.0) + 0 - 0, (height / 2.0) + 0);
		borderShape.lineTo((width / 2.0) + 0, (-height / 2.0) - 0.02 + 0);
		borderShape.lineTo((-width / 2.0) - 0 + 0, (-height / 2.0) - 0.02);
		borderShape.lineTo((-width / 2.0) - 0, (height / 2.0) + 0 - 0);
		innerShape = new THREE.Path();
		innerShape.moveTo((-width / 2.0), (height / 2.0));
		innerShape.lineTo((width / 2.0), (height / 2.0));
		innerShape.lineTo((width / 2.0), (-height / 2.0));
		innerShape.lineTo((-width / 2.0), (-height / 2.0));
		borderShape.holes.push(innerShape);
		borderGeometry = new THREE.ShapeGeometry(borderShape);
		borderGeometry.name = 'node_title_borderGeometry';
		borderMaterial = new THREE.MeshBasicMaterial( {color: new THREE.Color('rgba(77,77,77,1)').convertSRGBToLinear() , side: THREE.DoubleSide, transparent: true } );
		borderMaterial.name = 'node_title_borderMaterial';
		el.userData.border = new THREE.Mesh( borderGeometry, borderMaterial );
		el.userData.border.name = 'node_title_borderMesh';
		el.add(el.userData.border);
		el.userData.backgroundColorAlpha = 0.666667;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._node_title.material.opacity = v;
			if (me._node_title.userData.hasScrollbar) {
				me._node_title.userData.scrollbar.material.opacity = v;
				me._node_title.userData.scrollbarBg.material.opacity = v;
			}
			me._node_title.userData.border.material.opacity = v * me._node_title.userData.borderColorAlpha;
			if (me._node_title.userData.ggSubElement) {
				me._node_title.userData.ggSubElement.material.opacity = v
				me._node_title.userData.ggSubElement.visible = (v>0 && me._node_title.userData.visible);
			}
			me._node_title.visible = (v>0 && me._node_title.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._node_title.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._node_title.userData.backgroundColorAlpha = v;
			me._node_title.userData.setOpacity(me._node_title.userData.opacity);
		}
		el.userData.setBorderColor = function(v) {
			me._node_title.userData.border.material.color = v;
		}
		el.userData.setBorderColorAlpha = function(v) {
			me._node_title.userData.borderColorAlpha = v;
			me._node_title.userData.setOpacity(me._node_title.userData.opacity);
		}
		el.translateX(0);
		el.translateY(0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 250;
		el.userData.height = 32;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'node_title';
		el.userData.x = 0;
		el.userData.y = 0.01;
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._node_title.visible
			let parentEl = me._node_title.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._node_title.userData.opacity = v;
			v = v * me._node_title.userData.parentOpacity;
			me._node_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_title.children.length; i++) {
				let child = me._node_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._node_title.userData.parentOpacity = v;
			v = v * me._node_title.userData.opacity
			me._node_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_title.children.length; i++) {
				let child = me._node_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._node_title = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(0, 0.666667, 1);
		el.userData.textColor = new THREE.Color(0.952941, 0.952941, 0.952941);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 250;
		canvas.height = 32;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._node_title.userData.totalHeight = 3;
			me._node_title.userData.textLines = [];
			var ctx = me._node_title.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._node_title.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._node_title.userData.textLines.push(line);
					line = '';
					me._node_title.userData.totalHeight += me._node_title.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._node_title.userData.width - 20 - (scrollbar ? 25 : 0)) && i > 0) {
					me._node_title.userData.textLines.push(line);
					line = words[i];
					me._node_title.userData.totalHeight += me._node_title.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._node_title.userData.textLines.push(line);
			me._node_title.userData.totalHeight += me._node_title.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._node_title.userData.textCanvas;
			var ctx = me._node_title.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._node_title.userData.backgroundColor.r * 255 + ', ' + me._node_title.userData.backgroundColor.g * 255 + ', ' + me._node_title.userData.backgroundColor.b * 255 + ', ' + me._node_title.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._node_title.userData.textColor.r * 255 + ', ' + me._node_title.userData.textColor.g * 255 + ', ' + me._node_title.userData.textColor.b * 255 + ', ' + me._node_title.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = 10;
			ctx.textAlign = 'left';
			var y = 3;
			y += (canv.height - me._node_title.userData.totalHeight - 0) / 2;
			for (var i = 0; i < me._node_title.userData.textLines.length; i++) {
				var curTextLine = me._node_title.userData.textLines[i];
				var curTextLineBase = me._node_title.userData.textLines[i];
				if ((ctx.measureText(curTextLine).width + x + 10) > canv.width) {
					var cutChars = 0;
					do {
						cutChars++;
						curTextLine = curTextLineBase.substring(0, curTextLineBase.length - cutChars) + '...';
					} while (cutChars < curTextLineBase.length && (ctx.measureText(curTextLine).width + x + 10) > canv.width);
				}
				ctx.fillText(curTextLine, x, y);
				y += me._node_title.userData.lineHeight;
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'node_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._node_title.material.map) {
				me._node_title.material.map.dispose();
			}
			me._node_title.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._node_title.remove(...me._node_title.children);
			var canv = me._node_title.userData.textCanvas;
			var ctx = me._node_title.userData.textCanvasContext;
			ctx.font = '20px Verdana';
			me._node_title.userData.lineHeight = 20 * 1.2;
			me._node_title.userData.textLines = [];
			me._node_title.userData.textLines.push(me._node_title.userData.ggText);
			me._node_title.userData.totalHeight = 3;
			me._node_title.userData.totalHeight += me._node_title.userData.lineHeight;
			me._node_title.userData.boxWidth = me._node_title.userData.width;
			me._node_title.userData.boxHeight = me._node_title.userData.height;
			me._node_title.userData.hasScrollbar = false;
			canv.width = me._node_title.userData.boxWidth;
			canv.height = me._node_title.userData.boxHeight;
			ctx.font = '20px Verdana';
			me._node_title.userData.ggPaintCanvasText();
		}
		me._node_title.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(me.ggUserdata.title)));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._node_title.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._node_title.userData.ggUpdateText();
		el.userData.setBackgroundColor = function(v) {
			me._node_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._node_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._node_title.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._node_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="node_title";
		me._node_title.logicBlock_backgroundcolor = function() {
			var newLogicStateBackgroundColor;
			if (
				((me.elementMouseOver['node_title'] == true))
			)
			{
				newLogicStateBackgroundColor = 0;
			}
			else {
				newLogicStateBackgroundColor = -1;
			}
			if (me._node_title.ggCurrentLogicStateBackgroundColor != newLogicStateBackgroundColor) {
				me._node_title.ggCurrentLogicStateBackgroundColor = newLogicStateBackgroundColor;
				if (me._node_title.ggCurrentLogicStateBackgroundColor == 0) {
					me._node_title.userData.setBackgroundColor(new THREE.Color('#00aaff'));
					me._node_title.userData.setBackgroundColorAlpha(1);
					me._node_title.userData.ggUpdateText(true);
				}
				else {
					me._node_title.userData.setBackgroundColor(new THREE.Color('#00aaff'));
					me._node_title.userData.setBackgroundColorAlpha(0.666667);
					me._node_title.userData.ggUpdateText(true);
				}
			}
		}
		me._node_title.logicBlock_backgroundcolor();
		me._node_title.userData.onclick=function (e) {
			player.openNext("{"+me.ggNodeId+"}","");
		}
		me._node_title.userData.onmouseover=function (e) {
			me.elementMouseOver['node_title']=true;
			me._node_title.logicBlock_backgroundcolor();
		}
		me._node_title.userData.ontouchend=function (e) {
			me._node_title.logicBlock_backgroundcolor();
		}
		me._node_title.userData.onmouseout=function (e) {
			if (e && e.toElement) {
				var current = e.toElement;
				while (current = current.parentNode) {
				if (current == me._node_title__text)
					return;
				}
			}
			me.elementMouseOver['node_title']=false;
			me._node_title.logicBlock_backgroundcolor();
		}
		me._node_title.ggCurrentLogicStateBackgroundColor = -1;
		me._node_title.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['node_title']) {
				me.elementMouseOver['node_title']=true;
			}
		}
		me._node_title.userData.ggUpdatePosition=function (useTransition) {
		}
		me.__obj.add(me._node_title);
		me._node_title.logicBlock_backgroundcolor();
		me._node_title.userData.setOpacity(1.00);
	};
	function SkinHotspotClass_ht_video_url(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.name = 'ht_video_url';
		el.userData.x = -2;
		el.userData.y = 1;
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url.visible
			let parentEl = me._ht_video_url.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url.userData.opacity = v;
			v = v * me._ht_video_url.userData.parentOpacity;
			me._ht_video_url.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url.children.length; i++) {
				let child = me._ht_video_url.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url.userData.parentOpacity = v;
			v = v * me._ht_video_url.userData.opacity
			me._ht_video_url.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url.children.length; i++) {
				let child = me._ht_video_url.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url = el;
		el.userData.ggId="ht_video_url";
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_video_url.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.onmouseover=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_video_url']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.onmouseout=function (e) {
			player.setActiveHotspot(null);
			me.elementMouseOver['ht_video_url']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_video_url']) {
				player.setActiveHotspot(me.hotspot);
				me.elementMouseOver['ht_video_url']=true;
			}
		}
		me._ht_video_url.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_video_url_icon_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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'+
	'kAAAAABJRU5ErkJggg==');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_url_icon_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_url_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_icon.material) me._ht_video_url_icon.material.opacity = v;
			me._ht_video_url_icon.visible = (v>0 && me._ht_video_url_icon.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_icon.visible
			let parentEl = me._ht_video_url_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_icon.userData.opacity = v;
			v = v * me._ht_video_url_icon.userData.parentOpacity;
			me._ht_video_url_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_icon.children.length; i++) {
				let child = me._ht_video_url_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_icon.userData.parentOpacity = v;
			v = v * me._ht_video_url_icon.userData.opacity
			me._ht_video_url_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_icon.children.length; i++) {
				let child = me._ht_video_url_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_icon = el;
		el.userData.ggId="ht_video_url_icon";
		me._ht_video_url_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_url_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_url_icon.userData.transitions.length; i++) {
						if (me._ht_video_url_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_icon.userData.transitions[i].interval);
							me._ht_video_url_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_url_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_icon.scale.set(transition_scale.startScale.x + (me._ht_video_url_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_url_icon.position.x = (me._ht_video_url_icon.position.x - me._ht_video_url_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_video_url_icon.userData.curScaleOffX = scaleOffX;
						me._ht_video_url_icon.position.y = (me._ht_video_url_icon.position.y - me._ht_video_url_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_video_url_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_url_icon.userData.transitions.splice(me._ht_video_url_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_url_icon.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_video_url_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_icon.userData.transitions.length; i++) {
						if (me._ht_video_url_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_icon.userData.transitions[i].interval);
							me._ht_video_url_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_url_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_icon.scale.set(transition_scale.startScale.x + (me._ht_video_url_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_url_icon.position.x = (me._ht_video_url_icon.position.x - me._ht_video_url_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_video_url_icon.userData.curScaleOffX = scaleOffX;
						me._ht_video_url_icon.position.y = (me._ht_video_url_icon.position.y - me._ht_video_url_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_video_url_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_url_icon.userData.transitions.splice(me._ht_video_url_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_url_icon.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_video_url_icon.logicBlock_scaling();
		me._ht_video_url_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_icon.visible=false;
			me._ht_video_url_icon.userData.visible=false;
				}
				else {
			me._ht_video_url_icon.visible=((!me._ht_video_url_icon.material && Number(me._ht_video_url_icon.userData.opacity>0)) || Number(me._ht_video_url_icon.material.opacity)>0)?true:false;
			me._ht_video_url_icon.userData.visible=true;
				}
			}
		}
		me._ht_video_url_icon.logicBlock_visible();
		me._ht_video_url_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_video_url_hotspots', player.getVariableValue('vis_video_url_hotspots') + "<"+me.hotspot.id+">");
			me._ht_video_url_video.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_url_icon.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_video_url_icon']=true;
			me._ht_video_url_tooltip.logicBlock_visible();
			me._ht_video_url_icon.logicBlock_scaling();
		}
		me._ht_video_url_icon.userData.ontouchend=function (e) {
			me._ht_video_url_icon.logicBlock_scaling();
		}
		me._ht_video_url_icon.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_video_url_icon']=false;
			me._ht_video_url_tooltip.logicBlock_visible();
			me._ht_video_url_icon.logicBlock_scaling();
		}
		me._ht_video_url_icon.ggCurrentLogicStateScaling = -1;
		me._ht_video_url_icon.ggCurrentLogicStateVisible = -1;
		me._ht_video_url_icon.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_video_url_icon']) {
				me.elementMouseOver['ht_video_url_icon']=true;
				me._ht_video_url_tooltip.logicBlock_visible();
			}
		}
		me._ht_video_url_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(1, 0.22, 5, 5 );
		geometry.name = 'ht_video_url_tooltip_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_video_url_tooltip_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_url_tooltip.material.opacity = v;
			if (me._ht_video_url_tooltip.userData.hasScrollbar) {
				me._ht_video_url_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_video_url_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_url_tooltip.userData.ggSubElement) {
				me._ht_video_url_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_video_url_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_video_url_tooltip.userData.visible);
			}
			me._ht_video_url_tooltip.visible = (v>0 && me._ht_video_url_tooltip.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_url_tooltip.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_tooltip.userData.backgroundColorAlpha = v;
			me._ht_video_url_tooltip.userData.setOpacity(me._ht_video_url_tooltip.userData.opacity);
		}
		el.translateX(0);
		el.translateY(-0.365);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_url_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.365;
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_tooltip.visible
			let parentEl = me._ht_video_url_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_tooltip.userData.opacity = v;
			v = v * me._ht_video_url_tooltip.userData.parentOpacity;
			me._ht_video_url_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_tooltip.children.length; i++) {
				let child = me._ht_video_url_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_tooltip.userData.parentOpacity = v;
			v = v * me._ht_video_url_tooltip.userData.opacity
			me._ht_video_url_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_tooltip.children.length; i++) {
				let child = me._ht_video_url_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_tooltip = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(0, 0.666667, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 22;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_video_url_tooltip.userData.totalHeight = 13;
			me._ht_video_url_tooltip.userData.textLines = [];
			var ctx = me._ht_video_url_tooltip.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_video_url_tooltip.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_video_url_tooltip.userData.textLines.push(line);
					line = '';
					me._ht_video_url_tooltip.userData.totalHeight += me._ht_video_url_tooltip.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_video_url_tooltip.userData.width - 10 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_video_url_tooltip.userData.textLines.push(line);
					line = words[i];
					me._ht_video_url_tooltip.userData.totalHeight += me._ht_video_url_tooltip.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_video_url_tooltip.userData.textLines.push(line);
			me._ht_video_url_tooltip.userData.totalHeight += me._ht_video_url_tooltip.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_video_url_tooltip.userData.textCanvas;
			var ctx = me._ht_video_url_tooltip.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_url_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_video_url_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_video_url_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_video_url_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_url_tooltip.userData.textColor.r * 255 + ', ' + me._ht_video_url_tooltip.userData.textColor.g * 255 + ', ' + me._ht_video_url_tooltip.userData.textColor.b * 255 + ', ' + me._ht_video_url_tooltip.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = (me._ht_video_url_tooltip.userData.boxWidth - (me._ht_video_url_tooltip.userData.hasScrollbar ? 25 : 0)) / 2;
			ctx.textAlign = 'center';
			var y = 8;
			for (var i = 0; i < me._ht_video_url_tooltip.userData.textLines.length; i++) {
				ctx.fillText(me._ht_video_url_tooltip.userData.textLines[i], x, y);
				y += me._ht_video_url_tooltip.userData.lineHeight;
			}
			geometry = new THREE.PlaneBufferGeometry(me._ht_video_url_tooltip.userData.boxWidth / 100.0, me._ht_video_url_tooltip.userData.boxHeight / 100.0, 5, 5 );
			geometry.name = 'ht_video_url_tooltip_geometry';
			me._ht_video_url_tooltip.geometry.dispose();
			me._ht_video_url_tooltip.geometry = geometry;
			var diffY = me._ht_video_url_tooltip.userData.boxHeight - me._ht_video_url_tooltip.userData.height;
			me._ht_video_url_tooltip.position.y = me._ht_video_url_tooltip.userData.y - ((diffY / 2.0) / 100.0);
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_url_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_url_tooltip.material.map) {
				me._ht_video_url_tooltip.material.map.dispose();
			}
			me._ht_video_url_tooltip.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_video_url_tooltip.remove(...me._ht_video_url_tooltip.children);
			var canv = me._ht_video_url_tooltip.userData.textCanvas;
			var ctx = me._ht_video_url_tooltip.userData.textCanvasContext;
			ctx.font = '18px Verdana';
			me._ht_video_url_tooltip.userData.lineHeight = 18 * 1.2;
			me._ht_video_url_tooltip.userData.textLines = [];
			me._ht_video_url_tooltip.userData.textLines.push(me._ht_video_url_tooltip.userData.ggText);
			me._ht_video_url_tooltip.userData.totalHeight = 13;
			me._ht_video_url_tooltip.userData.totalHeight += me._ht_video_url_tooltip.userData.lineHeight;
			me._ht_video_url_tooltip.userData.boxWidth = ctx.measureText(me._ht_video_url_tooltip.userData.ggText).width + 10;
			me._ht_video_url_tooltip.userData.boxHeight = me._ht_video_url_tooltip.userData.totalHeight;
			canv.width = me._ht_video_url_tooltip.userData.boxWidth;
			canv.height = me._ht_video_url_tooltip.userData.boxHeight;
			ctx.font = '18px Verdana';
			me._ht_video_url_tooltip.userData.ggPaintCanvasText();
		}
		me._ht_video_url_tooltip.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_video_url_tooltip.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_video_url_tooltip.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_video_url_tooltip.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_url_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_url_tooltip.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_url_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_url_tooltip";
		me._ht_video_url_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_video_url_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_tooltip.visible=((!me._ht_video_url_tooltip.material && Number(me._ht_video_url_tooltip.userData.opacity>0)) || Number(me._ht_video_url_tooltip.material.opacity)>0)?true:false;
			me._ht_video_url_tooltip.userData.visible=true;
				}
				else {
			me._ht_video_url_tooltip.visible=false;
			me._ht_video_url_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_video_url_tooltip.logicBlock_visible();
		me._ht_video_url_tooltip.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url_icon.add(me._ht_video_url_tooltip);
		me._ht_video_url.add(me._ht_video_url_icon);
		geometry = new THREE.PlaneBufferGeometry(3.6, 2.4, 5, 5 );
		geometry.name = 'ht_video_url_bg_geometry';
		material = new THREE.MeshBasicMaterial( { color: new THREE.Color('rgba(0,170,255,0.784314)').convertSRGBToLinear(), side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_video_url_bg_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_url_bg.material.opacity = v * me._ht_video_url_bg.userData.backgroundColorAlpha;
			if (me._ht_video_url_bg.userData.ggSubElement) {
				me._ht_video_url_bg.userData.ggSubElement.material.opacity = v
				me._ht_video_url_bg.userData.ggSubElement.visible = (v>0 && me._ht_video_url_bg.userData.visible);
			}
			me._ht_video_url_bg.visible = (v>0 && me._ht_video_url_bg.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_url_bg.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_bg.userData.backgroundColorAlpha = v;
			me._ht_video_url_bg.userData.setOpacity(me._ht_video_url_bg.userData.opacity);
		}
		el.translateX(0);
		el.translateY(1.188);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 240;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.188;
		el.name = 'ht_video_url_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_bg.visible
			let parentEl = me._ht_video_url_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_bg.userData.opacity = v;
			v = v * me._ht_video_url_bg.userData.parentOpacity;
			me._ht_video_url_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_bg.children.length; i++) {
				let child = me._ht_video_url_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_bg.userData.parentOpacity = v;
			v = v * me._ht_video_url_bg.userData.opacity
			me._ht_video_url_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_bg.children.length; i++) {
				let child = me._ht_video_url_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_bg = el;
		el.userData.ggId="ht_video_url_bg";
		me._ht_video_url_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_url_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_bg.scale.set(transition_scale.startScale.x + (me._ht_video_url_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_url_bg.position.x = (me._ht_video_url_bg.position.x - me._ht_video_url_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_video_url_bg.userData.curScaleOffX = scaleOffX;
						me._ht_video_url_bg.position.y = (me._ht_video_url_bg.position.y - me._ht_video_url_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_video_url_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_url_bg.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_video_url_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_url_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_bg.scale.set(transition_scale.startScale.x + (me._ht_video_url_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_url_bg.position.x = (me._ht_video_url_bg.position.x - me._ht_video_url_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_video_url_bg.userData.curScaleOffX = scaleOffX;
						me._ht_video_url_bg.position.y = (me._ht_video_url_bg.position.y - me._ht_video_url_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_video_url_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_url_bg.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_video_url_bg.logicBlock_scaling();
		me._ht_video_url_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_url_bg.material ? me._ht_video_url_bg.material.opacity : me._ht_video_url_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_url_bg.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_video_url_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_url_bg.material ? me._ht_video_url_bg.material.opacity : me._ht_video_url_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_url_bg.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_video_url_bg.logicBlock_alpha();
		me._ht_video_url_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(3.4, 2.2, 5, 5 );
		geometry.name = 'ht_video_url_video_geometry';
		material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_url_video_material';
		el = new THREE.Mesh( geometry, material );
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 220;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_url_video';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_video.material) me._ht_video_url_video.material.opacity = v;
			me._ht_video_url_video.visible = (v>0 && me._ht_video_url_video.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_video.visible
			let parentEl = me._ht_video_url_video.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_video.userData.opacity = v;
			v = v * me._ht_video_url_video.userData.parentOpacity;
			me._ht_video_url_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_video.children.length; i++) {
				let child = me._ht_video_url_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_video.userData.parentOpacity = v;
			v = v * me._ht_video_url_video.userData.opacity
			me._ht_video_url_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_video.children.length; i++) {
				let child = me._ht_video_url_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_video = el;
		me._ht_video_url_video.userData.seekbars = [];
		me._ht_video_url_video.userData.ggInitMedia = function(media) {
			if (me._ht_video_url_video__vid) me._ht_video_url_video__vid.pause();
			me._ht_video_url_video__vid = document.createElement('video');
			player.registerVideoElement('ht_video_url_video', me._ht_video_url_video__vid);
			me._ht_video_url_video__vid.setAttribute('autoplay', '');
			me._ht_video_url_video__vid.setAttribute('crossOrigin', 'anonymous');
			me._ht_video_url_video__source = document.createElement('source');
			me._ht_video_url_video__source.setAttribute('src', media);
			me._ht_video_url_video__vid.addEventListener('loadedmetadata', function() {
				let videoAR = me._ht_video_url_video__vid.videoWidth / me._ht_video_url_video__vid.videoHeight;
				let elAR = me._ht_video_url_video.userData.width / me._ht_video_url_video.userData.height;
				if (videoAR > elAR) {
					me._ht_video_url_video.scale.set(1, (me._ht_video_url_video.userData.width / videoAR) / me._ht_video_url_video.userData.height, 1);
				} else {
					me._ht_video_url_video.scale.set((me._ht_video_url_video.userData.height * videoAR) / me._ht_video_url_video.userData.width, 1, 1);
				}
			}, false);
			me._ht_video_url_video__vid.appendChild(me._ht_video_url_video__source);
			videoTexture = new THREE.VideoTexture( me._ht_video_url_video__vid );
			videoTexture.name = 'ht_video_url_video_videoTexture';
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, transparent: true} );
			videoMaterial.name = 'ht_video_url_video_videoMaterial';
			videoMaterial.alphaTest = 0.5;
			me._ht_video_url_video.material = videoMaterial;
		}
		el.userData.ggId="ht_video_url_video";
		me._ht_video_url_video.userData.ggIsActive=function() {
			if (me._ht_video_url_video__vid != null) {
				return (me._ht_video_url_video__vid.paused == false && me._ht_video_url_video__vid.ended == false);
			} else {
				return false;
			}
		}
		me._ht_video_url_video.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_video.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_video.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_video.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_video.visible=((!me._ht_video_url_video.material && Number(me._ht_video_url_video.userData.opacity>0)) || Number(me._ht_video_url_video.material.opacity)>0)?true:false;
			me._ht_video_url_video.userData.visible=true;
					if (me._ht_video_url_video.userData.ggVideoNotLoaded) {
						me._ht_video_url_video.userData.ggInitMedia(me._ht_video_url_video.ggVideoSource);
					}
				}
				else {
			me._ht_video_url_video.visible=false;
			me._ht_video_url_video.userData.visible=false;
					me._ht_video_url_video.userData.ggInitMedia('');
				}
			}
		}
		me._ht_video_url_video.logicBlock_visible();
		me._ht_video_url_video.userData.onclick=function (e) {
			player.playPauseSound("ht_video_url_video","1");
		}
		me._ht_video_url_video.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url_bg.add(me._ht_video_url_video);
		me._ht_video_url.add(me._ht_video_url_bg);
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_video_url_close_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_url_close_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(2.1);
		el.translateY(0.975);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_url_close';
		el.userData.x = 2.1;
		el.userData.y = 0.975;
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_close.material) me._ht_video_url_close.material.opacity = v;
			me._ht_video_url_close.visible = (v>0 && me._ht_video_url_close.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_close.visible
			let parentEl = me._ht_video_url_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_close.userData.opacity = v;
			v = v * me._ht_video_url_close.userData.parentOpacity;
			me._ht_video_url_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_close.children.length; i++) {
				let child = me._ht_video_url_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_close.userData.parentOpacity = v;
			v = v * me._ht_video_url_close.userData.opacity
			me._ht_video_url_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_close.children.length; i++) {
				let child = me._ht_video_url_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_close = el;
		el.userData.ggId="ht_video_url_close";
		me._ht_video_url_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_url_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_close.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_url_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_close.scale.set(transition_scale.startScale.x + (me._ht_video_url_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_url_close.position.x = (me._ht_video_url_close.position.x - me._ht_video_url_close.userData.curScaleOffX) + scaleOffX;
						me._ht_video_url_close.userData.curScaleOffX = scaleOffX;
						me._ht_video_url_close.position.y = (me._ht_video_url_close.position.y - me._ht_video_url_close.userData.curScaleOffY) + scaleOffY;
						me._ht_video_url_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_url_close.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_video_url_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_url_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_close.scale.set(transition_scale.startScale.x + (me._ht_video_url_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_url_close.position.x = (me._ht_video_url_close.position.x - me._ht_video_url_close.userData.curScaleOffX) + scaleOffX;
						me._ht_video_url_close.userData.curScaleOffX = scaleOffX;
						me._ht_video_url_close.position.y = (me._ht_video_url_close.position.y - me._ht_video_url_close.userData.curScaleOffY) + scaleOffY;
						me._ht_video_url_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_url_close.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_video_url_close.logicBlock_scaling();
		me._ht_video_url_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_url_close.material ? me._ht_video_url_close.material.opacity : me._ht_video_url_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_url_close.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_video_url_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_url_close.material ? me._ht_video_url_close.material.opacity : me._ht_video_url_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_url_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_url_close.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_video_url_close.logicBlock_alpha();
		me._ht_video_url_close.userData.onclick=function (e) {
			player.setVariableValue('vis_video_url_hotspots', player.getVariableValue('vis_video_url_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_video_url_close.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_video_url_close']=true;
			me._ht_video_url_close.logicBlock_scaling();
		}
		me._ht_video_url_close.userData.ontouchend=function (e) {
			me._ht_video_url_close.logicBlock_scaling();
		}
		me._ht_video_url_close.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_video_url_close']=false;
			me._ht_video_url_close.logicBlock_scaling();
		}
		me._ht_video_url_close.ggCurrentLogicStateScaling = -1;
		me._ht_video_url_close.ggCurrentLogicStateAlpha = -1;
		me._ht_video_url_close.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_video_url_close']) {
				me.elementMouseOver['ht_video_url_close']=true;
			}
		}
		me._ht_video_url_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url.add(me._ht_video_url_close);
		me._ht_video_url.userData.setOpacity(1.00);
		me._ht_video_url_icon.logicBlock_scaling();
		me._ht_video_url_icon.logicBlock_visible();
		me._ht_video_url_icon.userData.setOpacity(1.00);
		me._ht_video_url_tooltip.logicBlock_visible();
		me._ht_video_url_tooltip.userData.setOpacity(1.00);
		me._ht_video_url_bg.logicBlock_scaling();
		me._ht_video_url_bg.logicBlock_alpha();
		me._ht_video_url_bg.userData.setOpacity(0.00);
		me._ht_video_url_video.logicBlock_visible();
		me._ht_video_url_video.userData.setOpacity(1.00);
		me._ht_video_url_video.userData.ggVideoSource = 'media_vr/';
		me._ht_video_url_video.userData.ggVideoNotLoaded = true;
		me._ht_video_url_close.logicBlock_scaling();
		me._ht_video_url_close.logicBlock_alpha();
		me._ht_video_url_close.userData.setOpacity(0.00);
			me.ggEvent_activehotspotchanged=function() {
				me._ht_video_url_tooltip.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				me._ht_video_url_icon.logicBlock_visible();
				me._ht_video_url_tooltip.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_scaling();
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_video.logicBlock_visible();
				me._ht_video_url_close.logicBlock_alpha();
			};
			me.ggEvent_configloaded=function() {
				me._ht_video_url_icon.logicBlock_visible();
				me._ht_video_url_tooltip.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_scaling();
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_video.logicBlock_visible();
				me._ht_video_url_close.logicBlock_alpha();
			};
			me.ggEvent_varchanged_vis_video_file_hotspots=function() {
				me._ht_video_url_video.logicBlock_visible();
			};
			me.ggEvent_varchanged_vis_video_url_hotspots=function() {
				me._ht_video_url_icon.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_scaling();
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_close.logicBlock_alpha();
			};
			me.__obj = me._ht_video_url;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_video_file(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.name = 'ht_video_file';
		el.userData.x = -2;
		el.userData.y = 1;
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file.visible
			let parentEl = me._ht_video_file.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file.userData.opacity = v;
			v = v * me._ht_video_file.userData.parentOpacity;
			me._ht_video_file.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file.children.length; i++) {
				let child = me._ht_video_file.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file.userData.parentOpacity = v;
			v = v * me._ht_video_file.userData.opacity
			me._ht_video_file.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file.children.length; i++) {
				let child = me._ht_video_file.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file = el;
		el.userData.ggId="ht_video_file";
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_video_file.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.onmouseover=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_video_file']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.onmouseout=function (e) {
			player.setActiveHotspot(null);
			me.elementMouseOver['ht_video_file']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_video_file']) {
				player.setActiveHotspot(me.hotspot);
				me.elementMouseOver['ht_video_file']=true;
			}
		}
		me._ht_video_file.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_video_file_icon_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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'+
	'kAAAAABJRU5ErkJggg==');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_file_icon_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_file_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_icon.material) me._ht_video_file_icon.material.opacity = v;
			me._ht_video_file_icon.visible = (v>0 && me._ht_video_file_icon.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_icon.visible
			let parentEl = me._ht_video_file_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_icon.userData.opacity = v;
			v = v * me._ht_video_file_icon.userData.parentOpacity;
			me._ht_video_file_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_icon.children.length; i++) {
				let child = me._ht_video_file_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_icon.userData.parentOpacity = v;
			v = v * me._ht_video_file_icon.userData.opacity
			me._ht_video_file_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_icon.children.length; i++) {
				let child = me._ht_video_file_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_icon = el;
		el.userData.ggId="ht_video_file_icon";
		me._ht_video_file_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_file_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_file_icon.userData.transitions.length; i++) {
						if (me._ht_video_file_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_icon.userData.transitions[i].interval);
							me._ht_video_file_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_file_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_icon.scale.set(transition_scale.startScale.x + (me._ht_video_file_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_file_icon.position.x = (me._ht_video_file_icon.position.x - me._ht_video_file_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_video_file_icon.userData.curScaleOffX = scaleOffX;
						me._ht_video_file_icon.position.y = (me._ht_video_file_icon.position.y - me._ht_video_file_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_video_file_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_file_icon.userData.transitions.splice(me._ht_video_file_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_file_icon.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_video_file_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_icon.userData.transitions.length; i++) {
						if (me._ht_video_file_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_icon.userData.transitions[i].interval);
							me._ht_video_file_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_file_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_icon.scale.set(transition_scale.startScale.x + (me._ht_video_file_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_file_icon.position.x = (me._ht_video_file_icon.position.x - me._ht_video_file_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_video_file_icon.userData.curScaleOffX = scaleOffX;
						me._ht_video_file_icon.position.y = (me._ht_video_file_icon.position.y - me._ht_video_file_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_video_file_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_file_icon.userData.transitions.splice(me._ht_video_file_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_file_icon.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_video_file_icon.logicBlock_scaling();
		me._ht_video_file_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_icon.visible=false;
			me._ht_video_file_icon.userData.visible=false;
				}
				else {
			me._ht_video_file_icon.visible=((!me._ht_video_file_icon.material && Number(me._ht_video_file_icon.userData.opacity>0)) || Number(me._ht_video_file_icon.material.opacity)>0)?true:false;
			me._ht_video_file_icon.userData.visible=true;
				}
			}
		}
		me._ht_video_file_icon.logicBlock_visible();
		me._ht_video_file_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_video_file_hotspots', player.getVariableValue('vis_video_file_hotspots') + "<"+me.hotspot.id+">");
			me._ht_video_file_video.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_file_icon.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_video_file_icon']=true;
			me._ht_video_file_tooltip.logicBlock_visible();
			me._ht_video_file_icon.logicBlock_scaling();
		}
		me._ht_video_file_icon.userData.ontouchend=function (e) {
			me._ht_video_file_icon.logicBlock_scaling();
		}
		me._ht_video_file_icon.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_video_file_icon']=false;
			me._ht_video_file_tooltip.logicBlock_visible();
			me._ht_video_file_icon.logicBlock_scaling();
		}
		me._ht_video_file_icon.ggCurrentLogicStateScaling = -1;
		me._ht_video_file_icon.ggCurrentLogicStateVisible = -1;
		me._ht_video_file_icon.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_video_file_icon']) {
				me.elementMouseOver['ht_video_file_icon']=true;
				me._ht_video_file_tooltip.logicBlock_visible();
			}
		}
		me._ht_video_file_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(1, 0.22, 5, 5 );
		geometry.name = 'ht_video_file_tooltip_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_video_file_tooltip_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_file_tooltip.material.opacity = v;
			if (me._ht_video_file_tooltip.userData.hasScrollbar) {
				me._ht_video_file_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_video_file_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_file_tooltip.userData.ggSubElement) {
				me._ht_video_file_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_video_file_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_video_file_tooltip.userData.visible);
			}
			me._ht_video_file_tooltip.visible = (v>0 && me._ht_video_file_tooltip.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_file_tooltip.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_tooltip.userData.backgroundColorAlpha = v;
			me._ht_video_file_tooltip.userData.setOpacity(me._ht_video_file_tooltip.userData.opacity);
		}
		el.translateX(0);
		el.translateY(-0.365);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_file_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.365;
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_tooltip.visible
			let parentEl = me._ht_video_file_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_tooltip.userData.opacity = v;
			v = v * me._ht_video_file_tooltip.userData.parentOpacity;
			me._ht_video_file_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_tooltip.children.length; i++) {
				let child = me._ht_video_file_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_tooltip.userData.parentOpacity = v;
			v = v * me._ht_video_file_tooltip.userData.opacity
			me._ht_video_file_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_tooltip.children.length; i++) {
				let child = me._ht_video_file_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_tooltip = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(0, 0.666667, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 22;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_video_file_tooltip.userData.totalHeight = 13;
			me._ht_video_file_tooltip.userData.textLines = [];
			var ctx = me._ht_video_file_tooltip.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_video_file_tooltip.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_video_file_tooltip.userData.textLines.push(line);
					line = '';
					me._ht_video_file_tooltip.userData.totalHeight += me._ht_video_file_tooltip.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_video_file_tooltip.userData.width - 10 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_video_file_tooltip.userData.textLines.push(line);
					line = words[i];
					me._ht_video_file_tooltip.userData.totalHeight += me._ht_video_file_tooltip.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_video_file_tooltip.userData.textLines.push(line);
			me._ht_video_file_tooltip.userData.totalHeight += me._ht_video_file_tooltip.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_video_file_tooltip.userData.textCanvas;
			var ctx = me._ht_video_file_tooltip.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_file_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_video_file_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_video_file_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_video_file_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_file_tooltip.userData.textColor.r * 255 + ', ' + me._ht_video_file_tooltip.userData.textColor.g * 255 + ', ' + me._ht_video_file_tooltip.userData.textColor.b * 255 + ', ' + me._ht_video_file_tooltip.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = (me._ht_video_file_tooltip.userData.boxWidth - (me._ht_video_file_tooltip.userData.hasScrollbar ? 25 : 0)) / 2;
			ctx.textAlign = 'center';
			var y = 8;
			for (var i = 0; i < me._ht_video_file_tooltip.userData.textLines.length; i++) {
				ctx.fillText(me._ht_video_file_tooltip.userData.textLines[i], x, y);
				y += me._ht_video_file_tooltip.userData.lineHeight;
			}
			geometry = new THREE.PlaneBufferGeometry(me._ht_video_file_tooltip.userData.boxWidth / 100.0, me._ht_video_file_tooltip.userData.boxHeight / 100.0, 5, 5 );
			geometry.name = 'ht_video_file_tooltip_geometry';
			me._ht_video_file_tooltip.geometry.dispose();
			me._ht_video_file_tooltip.geometry = geometry;
			var diffY = me._ht_video_file_tooltip.userData.boxHeight - me._ht_video_file_tooltip.userData.height;
			me._ht_video_file_tooltip.position.y = me._ht_video_file_tooltip.userData.y - ((diffY / 2.0) / 100.0);
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_file_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_file_tooltip.material.map) {
				me._ht_video_file_tooltip.material.map.dispose();
			}
			me._ht_video_file_tooltip.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_video_file_tooltip.remove(...me._ht_video_file_tooltip.children);
			var canv = me._ht_video_file_tooltip.userData.textCanvas;
			var ctx = me._ht_video_file_tooltip.userData.textCanvasContext;
			ctx.font = '18px Verdana';
			me._ht_video_file_tooltip.userData.lineHeight = 18 * 1.2;
			me._ht_video_file_tooltip.userData.textLines = [];
			me._ht_video_file_tooltip.userData.textLines.push(me._ht_video_file_tooltip.userData.ggText);
			me._ht_video_file_tooltip.userData.totalHeight = 13;
			me._ht_video_file_tooltip.userData.totalHeight += me._ht_video_file_tooltip.userData.lineHeight;
			me._ht_video_file_tooltip.userData.boxWidth = ctx.measureText(me._ht_video_file_tooltip.userData.ggText).width + 10;
			me._ht_video_file_tooltip.userData.boxHeight = me._ht_video_file_tooltip.userData.totalHeight;
			canv.width = me._ht_video_file_tooltip.userData.boxWidth;
			canv.height = me._ht_video_file_tooltip.userData.boxHeight;
			ctx.font = '18px Verdana';
			me._ht_video_file_tooltip.userData.ggPaintCanvasText();
		}
		me._ht_video_file_tooltip.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_video_file_tooltip.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_video_file_tooltip.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_video_file_tooltip.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_file_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_file_tooltip.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_file_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_file_tooltip";
		me._ht_video_file_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_video_file_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_tooltip.visible=((!me._ht_video_file_tooltip.material && Number(me._ht_video_file_tooltip.userData.opacity>0)) || Number(me._ht_video_file_tooltip.material.opacity)>0)?true:false;
			me._ht_video_file_tooltip.userData.visible=true;
				}
				else {
			me._ht_video_file_tooltip.visible=false;
			me._ht_video_file_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_video_file_tooltip.logicBlock_visible();
		me._ht_video_file_tooltip.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file_icon.add(me._ht_video_file_tooltip);
		me._ht_video_file.add(me._ht_video_file_icon);
		geometry = new THREE.PlaneBufferGeometry(3.6, 2.4, 5, 5 );
		geometry.name = 'ht_video_file_bg_geometry';
		material = new THREE.MeshBasicMaterial( { color: new THREE.Color('rgba(0,170,255,0.784314)').convertSRGBToLinear(), side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_video_file_bg_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_file_bg.material.opacity = v * me._ht_video_file_bg.userData.backgroundColorAlpha;
			if (me._ht_video_file_bg.userData.ggSubElement) {
				me._ht_video_file_bg.userData.ggSubElement.material.opacity = v
				me._ht_video_file_bg.userData.ggSubElement.visible = (v>0 && me._ht_video_file_bg.userData.visible);
			}
			me._ht_video_file_bg.visible = (v>0 && me._ht_video_file_bg.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_file_bg.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_bg.userData.backgroundColorAlpha = v;
			me._ht_video_file_bg.userData.setOpacity(me._ht_video_file_bg.userData.opacity);
		}
		el.translateX(0);
		el.translateY(1.188);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 240;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.188;
		el.name = 'ht_video_file_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_bg.visible
			let parentEl = me._ht_video_file_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_bg.userData.opacity = v;
			v = v * me._ht_video_file_bg.userData.parentOpacity;
			me._ht_video_file_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_bg.children.length; i++) {
				let child = me._ht_video_file_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_bg.userData.parentOpacity = v;
			v = v * me._ht_video_file_bg.userData.opacity
			me._ht_video_file_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_bg.children.length; i++) {
				let child = me._ht_video_file_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_bg = el;
		el.userData.ggId="ht_video_file_bg";
		me._ht_video_file_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_file_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_bg.scale.set(transition_scale.startScale.x + (me._ht_video_file_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_file_bg.position.x = (me._ht_video_file_bg.position.x - me._ht_video_file_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_video_file_bg.userData.curScaleOffX = scaleOffX;
						me._ht_video_file_bg.position.y = (me._ht_video_file_bg.position.y - me._ht_video_file_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_video_file_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_file_bg.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_video_file_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_file_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_bg.scale.set(transition_scale.startScale.x + (me._ht_video_file_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_file_bg.position.x = (me._ht_video_file_bg.position.x - me._ht_video_file_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_video_file_bg.userData.curScaleOffX = scaleOffX;
						me._ht_video_file_bg.position.y = (me._ht_video_file_bg.position.y - me._ht_video_file_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_video_file_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_file_bg.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_video_file_bg.logicBlock_scaling();
		me._ht_video_file_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_file_bg.material ? me._ht_video_file_bg.material.opacity : me._ht_video_file_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_file_bg.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_video_file_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_file_bg.material ? me._ht_video_file_bg.material.opacity : me._ht_video_file_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_file_bg.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_video_file_bg.logicBlock_alpha();
		me._ht_video_file_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(3.4, 2.2, 5, 5 );
		geometry.name = 'ht_video_file_video_geometry';
		material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_file_video_material';
		el = new THREE.Mesh( geometry, material );
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 220;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_file_video';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_video.material) me._ht_video_file_video.material.opacity = v;
			me._ht_video_file_video.visible = (v>0 && me._ht_video_file_video.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_video.visible
			let parentEl = me._ht_video_file_video.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_video.userData.opacity = v;
			v = v * me._ht_video_file_video.userData.parentOpacity;
			me._ht_video_file_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_video.children.length; i++) {
				let child = me._ht_video_file_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_video.userData.parentOpacity = v;
			v = v * me._ht_video_file_video.userData.opacity
			me._ht_video_file_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_video.children.length; i++) {
				let child = me._ht_video_file_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_video = el;
		me._ht_video_file_video.userData.seekbars = [];
		me._ht_video_file_video.userData.ggInitMedia = function(media) {
			if (me._ht_video_file_video__vid) me._ht_video_file_video__vid.pause();
			me._ht_video_file_video__vid = document.createElement('video');
			player.registerVideoElement('ht_video_file_video', me._ht_video_file_video__vid);
			me._ht_video_file_video__vid.setAttribute('autoplay', '');
			me._ht_video_file_video__vid.setAttribute('crossOrigin', 'anonymous');
			me._ht_video_file_video__source = document.createElement('source');
			me._ht_video_file_video__source.setAttribute('src', media);
			me._ht_video_file_video__vid.addEventListener('loadedmetadata', function() {
				let videoAR = me._ht_video_file_video__vid.videoWidth / me._ht_video_file_video__vid.videoHeight;
				let elAR = me._ht_video_file_video.userData.width / me._ht_video_file_video.userData.height;
				if (videoAR > elAR) {
					me._ht_video_file_video.scale.set(1, (me._ht_video_file_video.userData.width / videoAR) / me._ht_video_file_video.userData.height, 1);
				} else {
					me._ht_video_file_video.scale.set((me._ht_video_file_video.userData.height * videoAR) / me._ht_video_file_video.userData.width, 1, 1);
				}
			}, false);
			me._ht_video_file_video__vid.appendChild(me._ht_video_file_video__source);
			videoTexture = new THREE.VideoTexture( me._ht_video_file_video__vid );
			videoTexture.name = 'ht_video_file_video_videoTexture';
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, transparent: true} );
			videoMaterial.name = 'ht_video_file_video_videoMaterial';
			videoMaterial.alphaTest = 0.5;
			me._ht_video_file_video.material = videoMaterial;
		}
		el.userData.ggId="ht_video_file_video";
		me._ht_video_file_video.userData.ggIsActive=function() {
			if (me._ht_video_file_video__vid != null) {
				return (me._ht_video_file_video__vid.paused == false && me._ht_video_file_video__vid.ended == false);
			} else {
				return false;
			}
		}
		me._ht_video_file_video.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_video.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_video.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_video.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_video.visible=((!me._ht_video_file_video.material && Number(me._ht_video_file_video.userData.opacity>0)) || Number(me._ht_video_file_video.material.opacity)>0)?true:false;
			me._ht_video_file_video.userData.visible=true;
					if (me._ht_video_file_video.userData.ggVideoNotLoaded) {
						me._ht_video_file_video.userData.ggInitMedia(me._ht_video_file_video.ggVideoSource);
					}
				}
				else {
			me._ht_video_file_video.visible=false;
			me._ht_video_file_video.userData.visible=false;
					me._ht_video_file_video.userData.ggInitMedia('');
				}
			}
		}
		me._ht_video_file_video.logicBlock_visible();
		me._ht_video_file_video.userData.onclick=function (e) {
			player.playPauseSound("ht_video_file_video","1");
		}
		me._ht_video_file_video.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file_bg.add(me._ht_video_file_video);
		me._ht_video_file.add(me._ht_video_file_bg);
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_video_file_close_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_file_close_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(2.1);
		el.translateY(0.975);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_video_file_close';
		el.userData.x = 2.1;
		el.userData.y = 0.975;
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_close.material) me._ht_video_file_close.material.opacity = v;
			me._ht_video_file_close.visible = (v>0 && me._ht_video_file_close.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_close.visible
			let parentEl = me._ht_video_file_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_close.userData.opacity = v;
			v = v * me._ht_video_file_close.userData.parentOpacity;
			me._ht_video_file_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_close.children.length; i++) {
				let child = me._ht_video_file_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_close.userData.parentOpacity = v;
			v = v * me._ht_video_file_close.userData.opacity
			me._ht_video_file_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_close.children.length; i++) {
				let child = me._ht_video_file_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_close = el;
		el.userData.ggId="ht_video_file_close";
		me._ht_video_file_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_file_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_close.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_file_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_close.scale.set(transition_scale.startScale.x + (me._ht_video_file_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_file_close.position.x = (me._ht_video_file_close.position.x - me._ht_video_file_close.userData.curScaleOffX) + scaleOffX;
						me._ht_video_file_close.userData.curScaleOffX = scaleOffX;
						me._ht_video_file_close.position.y = (me._ht_video_file_close.position.y - me._ht_video_file_close.userData.curScaleOffY) + scaleOffY;
						me._ht_video_file_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_file_close.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_video_file_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_video_file_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_close.scale.set(transition_scale.startScale.x + (me._ht_video_file_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_video_file_close.position.x = (me._ht_video_file_close.position.x - me._ht_video_file_close.userData.curScaleOffX) + scaleOffX;
						me._ht_video_file_close.userData.curScaleOffX = scaleOffX;
						me._ht_video_file_close.position.y = (me._ht_video_file_close.position.y - me._ht_video_file_close.userData.curScaleOffY) + scaleOffY;
						me._ht_video_file_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_video_file_close.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_video_file_close.logicBlock_scaling();
		me._ht_video_file_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_file_close.material ? me._ht_video_file_close.material.opacity : me._ht_video_file_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_file_close.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_video_file_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_video_file_close.material ? me._ht_video_file_close.material.opacity : me._ht_video_file_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_video_file_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_video_file_close.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_video_file_close.logicBlock_alpha();
		me._ht_video_file_close.userData.onclick=function (e) {
			player.setVariableValue('vis_video_file_hotspots', player.getVariableValue('vis_video_file_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_video_file_close.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_video_file_close']=true;
			me._ht_video_file_close.logicBlock_scaling();
		}
		me._ht_video_file_close.userData.ontouchend=function (e) {
			me._ht_video_file_close.logicBlock_scaling();
		}
		me._ht_video_file_close.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_video_file_close']=false;
			me._ht_video_file_close.logicBlock_scaling();
		}
		me._ht_video_file_close.ggCurrentLogicStateScaling = -1;
		me._ht_video_file_close.ggCurrentLogicStateAlpha = -1;
		me._ht_video_file_close.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_video_file_close']) {
				me.elementMouseOver['ht_video_file_close']=true;
			}
		}
		me._ht_video_file_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file.add(me._ht_video_file_close);
		me._ht_video_file.userData.setOpacity(1.00);
		me._ht_video_file_icon.logicBlock_scaling();
		me._ht_video_file_icon.logicBlock_visible();
		me._ht_video_file_icon.userData.setOpacity(1.00);
		me._ht_video_file_tooltip.logicBlock_visible();
		me._ht_video_file_tooltip.userData.setOpacity(1.00);
		me._ht_video_file_bg.logicBlock_scaling();
		me._ht_video_file_bg.logicBlock_alpha();
		me._ht_video_file_bg.userData.setOpacity(0.00);
		me._ht_video_file_video.logicBlock_visible();
		me._ht_video_file_video.userData.setOpacity(1.00);
		me._ht_video_file_video.userData.ggVideoSource = 'media_vr/';
		me._ht_video_file_video.userData.ggVideoNotLoaded = true;
		me._ht_video_file_close.logicBlock_scaling();
		me._ht_video_file_close.logicBlock_alpha();
		me._ht_video_file_close.userData.setOpacity(0.00);
			me.ggEvent_activehotspotchanged=function() {
				me._ht_video_file_tooltip.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				me._ht_video_file_icon.logicBlock_visible();
				me._ht_video_file_tooltip.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_scaling();
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_video.logicBlock_visible();
				me._ht_video_file_close.logicBlock_alpha();
			};
			me.ggEvent_configloaded=function() {
				me._ht_video_file_icon.logicBlock_visible();
				me._ht_video_file_tooltip.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_scaling();
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_video.logicBlock_visible();
				me._ht_video_file_close.logicBlock_alpha();
			};
			me.ggEvent_varchanged_vis_video_file_hotspots=function() {
				me._ht_video_file_icon.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_scaling();
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_video.logicBlock_visible();
				me._ht_video_file_close.logicBlock_alpha();
			};
			me.__obj = me._ht_video_file;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_node(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.name = 'ht_node';
		el.userData.x = -2;
		el.userData.y = 1;
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_node.visible
			let parentEl = me._ht_node.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node.userData.opacity = v;
			v = v * me._ht_node.userData.parentOpacity;
			me._ht_node.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node.children.length; i++) {
				let child = me._ht_node.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node.userData.parentOpacity = v;
			v = v * me._ht_node.userData.opacity
			me._ht_node.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node.children.length; i++) {
				let child = me._ht_node.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node = el;
		el.userData.ggId="ht_node";
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_node.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.onmouseover=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_node']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.onmouseout=function (e) {
			player.setActiveHotspot(null);
			me.elementMouseOver['ht_node']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_node']) {
				player.setActiveHotspot(me.hotspot);
				me.elementMouseOver['ht_node']=true;
			}
		}
		me._ht_node.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_node_icon_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_node_icon_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_node_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_node_icon.material) me._ht_node_icon.material.opacity = v;
			me._ht_node_icon.visible = (v>0 && me._ht_node_icon.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_node_icon.visible
			let parentEl = me._ht_node_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node_icon.userData.opacity = v;
			v = v * me._ht_node_icon.userData.parentOpacity;
			me._ht_node_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_icon.children.length; i++) {
				let child = me._ht_node_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_icon.userData.parentOpacity = v;
			v = v * me._ht_node_icon.userData.opacity
			me._ht_node_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_icon.children.length; i++) {
				let child = me._ht_node_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node_icon = el;
		el.userData.ggId="ht_node_icon";
		me._ht_node_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_node_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_node_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_node_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_node_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_node_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_node_icon.userData.transitions.length; i++) {
						if (me._ht_node_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_node_icon.userData.transitions[i].interval);
							me._ht_node_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_node_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_node_icon.scale.set(transition_scale.startScale.x + (me._ht_node_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_node_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_node_icon.position.x = (me._ht_node_icon.position.x - me._ht_node_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_node_icon.userData.curScaleOffX = scaleOffX;
						me._ht_node_icon.position.y = (me._ht_node_icon.position.y - me._ht_node_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_node_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_node_icon.userData.transitions.splice(me._ht_node_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_node_icon.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_node_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_node_icon.userData.transitions.length; i++) {
						if (me._ht_node_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_node_icon.userData.transitions[i].interval);
							me._ht_node_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_node_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_node_icon.scale.set(transition_scale.startScale.x + (me._ht_node_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_node_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_node_icon.position.x = (me._ht_node_icon.position.x - me._ht_node_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_node_icon.userData.curScaleOffX = scaleOffX;
						me._ht_node_icon.position.y = (me._ht_node_icon.position.y - me._ht_node_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_node_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_node_icon.userData.transitions.splice(me._ht_node_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_node_icon.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_node_icon.logicBlock_scaling();
		me._ht_node_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('vis_image_hotspots') == "true"))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_node_icon.visible=false;
			me._ht_node_icon.userData.visible=false;
				}
				else {
			me._ht_node_icon.visible=((!me._ht_node_icon.material && Number(me._ht_node_icon.userData.opacity>0)) || Number(me._ht_node_icon.material.opacity)>0)?true:false;
			me._ht_node_icon.userData.visible=true;
				}
			}
		}
		me._ht_node_icon.logicBlock_visible();
		me._ht_node_icon.userData.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
		}
		me._ht_node_icon.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_node_icon']=true;
			me._ht_node_tooltip.logicBlock_visible();
			me._ht_node_icon.logicBlock_scaling();
		}
		me._ht_node_icon.userData.ontouchend=function (e) {
			me._ht_node_icon.logicBlock_scaling();
		}
		me._ht_node_icon.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_node_icon']=false;
			me._ht_node_tooltip.logicBlock_visible();
			me._ht_node_icon.logicBlock_scaling();
		}
		me._ht_node_icon.ggCurrentLogicStateScaling = -1;
		me._ht_node_icon.ggCurrentLogicStateVisible = -1;
		me._ht_node_icon.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_node_icon']) {
				me.elementMouseOver['ht_node_icon']=true;
				me._ht_node_tooltip.logicBlock_visible();
			}
		}
		me._ht_node_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(1, 0.22, 5, 5 );
		geometry.name = 'ht_node_tooltip_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_node_tooltip_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_node_tooltip.material.opacity = v;
			if (me._ht_node_tooltip.userData.hasScrollbar) {
				me._ht_node_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_node_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_node_tooltip.userData.ggSubElement) {
				me._ht_node_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_node_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_node_tooltip.userData.visible);
			}
			me._ht_node_tooltip.visible = (v>0 && me._ht_node_tooltip.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_node_tooltip.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_tooltip.userData.backgroundColorAlpha = v;
			me._ht_node_tooltip.userData.setOpacity(me._ht_node_tooltip.userData.opacity);
		}
		el.translateX(0);
		el.translateY(-0.365);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_node_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.365;
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_node_tooltip.visible
			let parentEl = me._ht_node_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node_tooltip.userData.opacity = v;
			v = v * me._ht_node_tooltip.userData.parentOpacity;
			me._ht_node_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_tooltip.children.length; i++) {
				let child = me._ht_node_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_tooltip.userData.parentOpacity = v;
			v = v * me._ht_node_tooltip.userData.opacity
			me._ht_node_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_tooltip.children.length; i++) {
				let child = me._ht_node_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node_tooltip = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(0, 0.666667, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 22;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_node_tooltip.userData.totalHeight = 13;
			me._ht_node_tooltip.userData.textLines = [];
			var ctx = me._ht_node_tooltip.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_node_tooltip.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_node_tooltip.userData.textLines.push(line);
					line = '';
					me._ht_node_tooltip.userData.totalHeight += me._ht_node_tooltip.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_node_tooltip.userData.width - 10 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_node_tooltip.userData.textLines.push(line);
					line = words[i];
					me._ht_node_tooltip.userData.totalHeight += me._ht_node_tooltip.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_node_tooltip.userData.textLines.push(line);
			me._ht_node_tooltip.userData.totalHeight += me._ht_node_tooltip.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_node_tooltip.userData.textCanvas;
			var ctx = me._ht_node_tooltip.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_node_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_node_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_node_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_node_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_node_tooltip.userData.textColor.r * 255 + ', ' + me._ht_node_tooltip.userData.textColor.g * 255 + ', ' + me._ht_node_tooltip.userData.textColor.b * 255 + ', ' + me._ht_node_tooltip.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = (me._ht_node_tooltip.userData.boxWidth - (me._ht_node_tooltip.userData.hasScrollbar ? 25 : 0)) / 2;
			ctx.textAlign = 'center';
			var y = 8;
			for (var i = 0; i < me._ht_node_tooltip.userData.textLines.length; i++) {
				ctx.fillText(me._ht_node_tooltip.userData.textLines[i], x, y);
				y += me._ht_node_tooltip.userData.lineHeight;
			}
			geometry = new THREE.PlaneBufferGeometry(me._ht_node_tooltip.userData.boxWidth / 100.0, me._ht_node_tooltip.userData.boxHeight / 100.0, 5, 5 );
			geometry.name = 'ht_node_tooltip_geometry';
			me._ht_node_tooltip.geometry.dispose();
			me._ht_node_tooltip.geometry = geometry;
			var diffY = me._ht_node_tooltip.userData.boxHeight - me._ht_node_tooltip.userData.height;
			me._ht_node_tooltip.position.y = me._ht_node_tooltip.userData.y - ((diffY / 2.0) / 100.0);
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_node_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_node_tooltip.material.map) {
				me._ht_node_tooltip.material.map.dispose();
			}
			me._ht_node_tooltip.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_node_tooltip.remove(...me._ht_node_tooltip.children);
			var canv = me._ht_node_tooltip.userData.textCanvas;
			var ctx = me._ht_node_tooltip.userData.textCanvasContext;
			ctx.font = '18px Verdana';
			me._ht_node_tooltip.userData.lineHeight = 18 * 1.2;
			me._ht_node_tooltip.userData.textLines = [];
			me._ht_node_tooltip.userData.textLines.push(me._ht_node_tooltip.userData.ggText);
			me._ht_node_tooltip.userData.totalHeight = 13;
			me._ht_node_tooltip.userData.totalHeight += me._ht_node_tooltip.userData.lineHeight;
			me._ht_node_tooltip.userData.boxWidth = ctx.measureText(me._ht_node_tooltip.userData.ggText).width + 10;
			me._ht_node_tooltip.userData.boxHeight = me._ht_node_tooltip.userData.totalHeight;
			canv.width = me._ht_node_tooltip.userData.boxWidth;
			canv.height = me._ht_node_tooltip.userData.boxHeight;
			ctx.font = '18px Verdana';
			me._ht_node_tooltip.userData.ggPaintCanvasText();
		}
		me._ht_node_tooltip.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_node_tooltip.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_node_tooltip.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_node_tooltip.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_node_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_node_tooltip.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_node_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_node_tooltip";
		me._ht_node_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_node_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_node_tooltip.visible=((!me._ht_node_tooltip.material && Number(me._ht_node_tooltip.userData.opacity>0)) || Number(me._ht_node_tooltip.material.opacity)>0)?true:false;
			me._ht_node_tooltip.userData.visible=true;
				}
				else {
			me._ht_node_tooltip.visible=false;
			me._ht_node_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_node_tooltip.logicBlock_visible();
		me._ht_node_tooltip.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node_icon.add(me._ht_node_tooltip);
		me._ht_node.add(me._ht_node_icon);
		me._ht_node.userData.setOpacity(1.00);
		me._ht_node_icon.logicBlock_scaling();
		me._ht_node_icon.logicBlock_visible();
		me._ht_node_icon.userData.setOpacity(1.00);
		me._ht_node_tooltip.logicBlock_visible();
		me._ht_node_tooltip.userData.setOpacity(1.00);
			me.ggEvent_activehotspotchanged=function() {
				me._ht_node_tooltip.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				me._ht_node_icon.logicBlock_visible();
				me._ht_node_tooltip.logicBlock_visible();
			};
			me.ggEvent_configloaded=function() {
				me._ht_node_icon.logicBlock_visible();
				me._ht_node_tooltip.logicBlock_visible();
			};
			me.ggEvent_varchanged_vis_image_hotspots=function() {
				me._ht_node_icon.logicBlock_visible();
			};
			me.__obj = me._ht_node;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_image(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.name = 'ht_image';
		el.userData.x = -2;
		el.userData.y = 1;
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_image.visible
			let parentEl = me._ht_image.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image.userData.opacity = v;
			v = v * me._ht_image.userData.parentOpacity;
			me._ht_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image.children.length; i++) {
				let child = me._ht_image.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image.userData.parentOpacity = v;
			v = v * me._ht_image.userData.opacity
			me._ht_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image.children.length; i++) {
				let child = me._ht_image.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image = el;
		el.userData.ggId="ht_image";
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_image.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.onmouseover=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_image']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.onmouseout=function (e) {
			player.setActiveHotspot(null);
			me.elementMouseOver['ht_image']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_image']) {
				player.setActiveHotspot(me.hotspot);
				me.elementMouseOver['ht_image']=true;
			}
		}
		me._ht_image.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_image_icon_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_image_icon_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_image_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_image_icon.material) me._ht_image_icon.material.opacity = v;
			me._ht_image_icon.visible = (v>0 && me._ht_image_icon.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_image_icon.visible
			let parentEl = me._ht_image_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_icon.userData.opacity = v;
			v = v * me._ht_image_icon.userData.parentOpacity;
			me._ht_image_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_icon.children.length; i++) {
				let child = me._ht_image_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_icon.userData.parentOpacity = v;
			v = v * me._ht_image_icon.userData.opacity
			me._ht_image_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_icon.children.length; i++) {
				let child = me._ht_image_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_icon = el;
		el.userData.ggId="ht_image_icon";
		me._ht_image_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_image_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_image_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_image_icon.userData.transitions.length; i++) {
						if (me._ht_image_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_icon.userData.transitions[i].interval);
							me._ht_image_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_image_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_icon.scale.set(transition_scale.startScale.x + (me._ht_image_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_image_icon.position.x = (me._ht_image_icon.position.x - me._ht_image_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_image_icon.userData.curScaleOffX = scaleOffX;
						me._ht_image_icon.position.y = (me._ht_image_icon.position.y - me._ht_image_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_image_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_image_icon.userData.transitions.splice(me._ht_image_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_image_icon.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_image_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_icon.userData.transitions.length; i++) {
						if (me._ht_image_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_icon.userData.transitions[i].interval);
							me._ht_image_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_image_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_icon.scale.set(transition_scale.startScale.x + (me._ht_image_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_image_icon.position.x = (me._ht_image_icon.position.x - me._ht_image_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_image_icon.userData.curScaleOffX = scaleOffX;
						me._ht_image_icon.position.y = (me._ht_image_icon.position.y - me._ht_image_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_image_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_image_icon.userData.transitions.splice(me._ht_image_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_image_icon.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_image_icon.logicBlock_scaling();
		me._ht_image_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('vis_image_hotspots') == "true"))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_image_icon.visible=false;
			me._ht_image_icon.userData.visible=false;
				}
				else {
			me._ht_image_icon.visible=((!me._ht_image_icon.material && Number(me._ht_image_icon.userData.opacity>0)) || Number(me._ht_image_icon.material.opacity)>0)?true:false;
			me._ht_image_icon.userData.visible=true;
				}
			}
		}
		me._ht_image_icon.logicBlock_visible();
		me._ht_image_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_image_hotspots', player.getVariableValue('vis_image_hotspots') + "<"+me.hotspot.id+">");
		}
		me._ht_image_icon.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_image_icon']=true;
			me._ht_image_tooltip.logicBlock_visible();
			me._ht_image_icon.logicBlock_scaling();
		}
		me._ht_image_icon.userData.ontouchend=function (e) {
			me._ht_image_icon.logicBlock_scaling();
		}
		me._ht_image_icon.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_image_icon']=false;
			me._ht_image_tooltip.logicBlock_visible();
			me._ht_image_icon.logicBlock_scaling();
		}
		me._ht_image_icon.ggCurrentLogicStateScaling = -1;
		me._ht_image_icon.ggCurrentLogicStateVisible = -1;
		me._ht_image_icon.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_image_icon']) {
				me.elementMouseOver['ht_image_icon']=true;
				me._ht_image_tooltip.logicBlock_visible();
			}
		}
		me._ht_image_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(1, 0.22, 5, 5 );
		geometry.name = 'ht_image_tooltip_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_image_tooltip_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_image_tooltip.material.opacity = v;
			if (me._ht_image_tooltip.userData.hasScrollbar) {
				me._ht_image_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_image_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_image_tooltip.userData.ggSubElement) {
				me._ht_image_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_image_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_image_tooltip.userData.visible);
			}
			me._ht_image_tooltip.visible = (v>0 && me._ht_image_tooltip.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_image_tooltip.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_tooltip.userData.backgroundColorAlpha = v;
			me._ht_image_tooltip.userData.setOpacity(me._ht_image_tooltip.userData.opacity);
		}
		el.translateX(0);
		el.translateY(-0.365);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_image_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.365;
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_image_tooltip.visible
			let parentEl = me._ht_image_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_tooltip.userData.opacity = v;
			v = v * me._ht_image_tooltip.userData.parentOpacity;
			me._ht_image_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_tooltip.children.length; i++) {
				let child = me._ht_image_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_tooltip.userData.parentOpacity = v;
			v = v * me._ht_image_tooltip.userData.opacity
			me._ht_image_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_tooltip.children.length; i++) {
				let child = me._ht_image_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_tooltip = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(0, 0.666667, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 22;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_image_tooltip.userData.totalHeight = 13;
			me._ht_image_tooltip.userData.textLines = [];
			var ctx = me._ht_image_tooltip.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_image_tooltip.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_image_tooltip.userData.textLines.push(line);
					line = '';
					me._ht_image_tooltip.userData.totalHeight += me._ht_image_tooltip.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_image_tooltip.userData.width - 10 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_image_tooltip.userData.textLines.push(line);
					line = words[i];
					me._ht_image_tooltip.userData.totalHeight += me._ht_image_tooltip.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_image_tooltip.userData.textLines.push(line);
			me._ht_image_tooltip.userData.totalHeight += me._ht_image_tooltip.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_image_tooltip.userData.textCanvas;
			var ctx = me._ht_image_tooltip.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_image_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_image_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_image_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_image_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_image_tooltip.userData.textColor.r * 255 + ', ' + me._ht_image_tooltip.userData.textColor.g * 255 + ', ' + me._ht_image_tooltip.userData.textColor.b * 255 + ', ' + me._ht_image_tooltip.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = (me._ht_image_tooltip.userData.boxWidth - (me._ht_image_tooltip.userData.hasScrollbar ? 25 : 0)) / 2;
			ctx.textAlign = 'center';
			var y = 8;
			for (var i = 0; i < me._ht_image_tooltip.userData.textLines.length; i++) {
				ctx.fillText(me._ht_image_tooltip.userData.textLines[i], x, y);
				y += me._ht_image_tooltip.userData.lineHeight;
			}
			geometry = new THREE.PlaneBufferGeometry(me._ht_image_tooltip.userData.boxWidth / 100.0, me._ht_image_tooltip.userData.boxHeight / 100.0, 5, 5 );
			geometry.name = 'ht_image_tooltip_geometry';
			me._ht_image_tooltip.geometry.dispose();
			me._ht_image_tooltip.geometry = geometry;
			var diffY = me._ht_image_tooltip.userData.boxHeight - me._ht_image_tooltip.userData.height;
			me._ht_image_tooltip.position.y = me._ht_image_tooltip.userData.y - ((diffY / 2.0) / 100.0);
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_image_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_image_tooltip.material.map) {
				me._ht_image_tooltip.material.map.dispose();
			}
			me._ht_image_tooltip.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_image_tooltip.remove(...me._ht_image_tooltip.children);
			var canv = me._ht_image_tooltip.userData.textCanvas;
			var ctx = me._ht_image_tooltip.userData.textCanvasContext;
			ctx.font = '18px Verdana';
			me._ht_image_tooltip.userData.lineHeight = 18 * 1.2;
			me._ht_image_tooltip.userData.textLines = [];
			me._ht_image_tooltip.userData.textLines.push(me._ht_image_tooltip.userData.ggText);
			me._ht_image_tooltip.userData.totalHeight = 13;
			me._ht_image_tooltip.userData.totalHeight += me._ht_image_tooltip.userData.lineHeight;
			me._ht_image_tooltip.userData.boxWidth = ctx.measureText(me._ht_image_tooltip.userData.ggText).width + 10;
			me._ht_image_tooltip.userData.boxHeight = me._ht_image_tooltip.userData.totalHeight;
			canv.width = me._ht_image_tooltip.userData.boxWidth;
			canv.height = me._ht_image_tooltip.userData.boxHeight;
			ctx.font = '18px Verdana';
			me._ht_image_tooltip.userData.ggPaintCanvasText();
		}
		me._ht_image_tooltip.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_image_tooltip.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_image_tooltip.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_image_tooltip.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_image_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_image_tooltip.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_image_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_image_tooltip";
		me._ht_image_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_image_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_image_tooltip.visible=((!me._ht_image_tooltip.material && Number(me._ht_image_tooltip.userData.opacity>0)) || Number(me._ht_image_tooltip.material.opacity)>0)?true:false;
			me._ht_image_tooltip.userData.visible=true;
				}
				else {
			me._ht_image_tooltip.visible=false;
			me._ht_image_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_image_tooltip.logicBlock_visible();
		me._ht_image_tooltip.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_image_icon.add(me._ht_image_tooltip);
		me._ht_image.add(me._ht_image_icon);
		geometry = new THREE.PlaneBufferGeometry(3.6, 3.6, 5, 5 );
		geometry.name = 'ht_image_bg_geometry';
		material = new THREE.MeshBasicMaterial( { color: new THREE.Color('rgba(0,170,255,0.784314)').convertSRGBToLinear(), side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_image_bg_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_image_bg.material.opacity = v * me._ht_image_bg.userData.backgroundColorAlpha;
			if (me._ht_image_bg.userData.ggSubElement) {
				me._ht_image_bg.userData.ggSubElement.material.opacity = v
				me._ht_image_bg.userData.ggSubElement.visible = (v>0 && me._ht_image_bg.userData.visible);
			}
			me._ht_image_bg.visible = (v>0 && me._ht_image_bg.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_image_bg.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_bg.userData.backgroundColorAlpha = v;
			me._ht_image_bg.userData.setOpacity(me._ht_image_bg.userData.opacity);
		}
		el.translateX(0);
		el.translateY(1.782);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 360;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.782;
		el.name = 'ht_image_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_image_bg.visible
			let parentEl = me._ht_image_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_bg.userData.opacity = v;
			v = v * me._ht_image_bg.userData.parentOpacity;
			me._ht_image_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_bg.children.length; i++) {
				let child = me._ht_image_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_bg.userData.parentOpacity = v;
			v = v * me._ht_image_bg.userData.opacity
			me._ht_image_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_bg.children.length; i++) {
				let child = me._ht_image_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_bg = el;
		el.userData.ggId="ht_image_bg";
		me._ht_image_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_image_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_image_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_bg.scale.set(transition_scale.startScale.x + (me._ht_image_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_image_bg.position.x = (me._ht_image_bg.position.x - me._ht_image_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_image_bg.userData.curScaleOffX = scaleOffX;
						me._ht_image_bg.position.y = (me._ht_image_bg.position.y - me._ht_image_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_image_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_image_bg.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_image_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_image_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_bg.scale.set(transition_scale.startScale.x + (me._ht_image_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_image_bg.position.x = (me._ht_image_bg.position.x - me._ht_image_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_image_bg.userData.curScaleOffX = scaleOffX;
						me._ht_image_bg.position.y = (me._ht_image_bg.position.y - me._ht_image_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_image_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_image_bg.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_image_bg.logicBlock_scaling();
		me._ht_image_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_image_bg.material ? me._ht_image_bg.material.opacity : me._ht_image_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_image_bg.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_image_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_image_bg.material ? me._ht_image_bg.material.opacity : me._ht_image_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_image_bg.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_image_bg.logicBlock_alpha();
		me._ht_image_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.backgroundColorAlpha = 1;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_image_img.userData.ggSubElement) {
				me._ht_image_img.userData.ggSubElement.material.opacity = v
				me._ht_image_img.userData.ggSubElement.visible = (v>0 && me._ht_image_img.userData.visible);
			}
			me._ht_image_img.visible = (v>0 && me._ht_image_img.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 340;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_image_img';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_image_img.visible
			let parentEl = me._ht_image_img.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_img.userData.opacity = v;
			v = v * me._ht_image_img.userData.parentOpacity;
			me._ht_image_img.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_img.children.length; i++) {
				let child = me._ht_image_img.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_img.userData.parentOpacity = v;
			v = v * me._ht_image_img.userData.opacity
			me._ht_image_img.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_img.children.length; i++) {
				let child = me._ht_image_img.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_img = el;
		currentWidth = 340;
		currentHeight = 340;
		var img = {};
		img.geometry = new THREE.PlaneBufferGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5 );
		img.geometry.name = 'ht_image_img_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				var loadedMaterial = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
				loadedMaterial.name = 'ht_image_img_subElementMaterial';
				me._ht_image_img.userData.ggSubElement.material = loadedMaterial;
				me._ht_image_img.userData.ggUpdatePosition();
				me._ht_image_img.userData.ggText = extUrl;
				me._ht_image_img.userData.setOpacity(me._ht_image_img.userData.opacity);
			});
		};
		player.addListener('changenode', function() {
		});
		var extUrl=basePath + ""+player._(me.hotspot.url)+"";
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_image_img_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_image_img_subElement';
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 340;
		el.userData.clientHeight = 340;
		el.userData.ggId="ht_image_img";
		me._ht_image_img.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_image_img.userData.clientWidth;
			var parentHeight = me._ht_image_img.userData.clientHeight;
			var img = me._ht_image_img.userData.ggSubElement;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = parentHeight * aspectRatioImg;
			img.geometry = new THREE.PlaneBufferGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5 );
			img.geometry.name = 'ht_image_img_imgGeometry';
			} else {
				currentWidth = parentWidth;
				currentHeight = parentWidth / aspectRatioImg;
			img.geometry = new THREE.PlaneBufferGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5 );
			img.geometry.name = 'ht_image_img_imgGeometry';
			};
		}
		me._ht_image_bg.add(me._ht_image_img);
		me._ht_image.add(me._ht_image_bg);
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_image_close_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_image_close_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(2.1);
		el.translateY(1.575);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_image_close';
		el.userData.x = 2.1;
		el.userData.y = 1.575;
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_image_close.material) me._ht_image_close.material.opacity = v;
			me._ht_image_close.visible = (v>0 && me._ht_image_close.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_image_close.visible
			let parentEl = me._ht_image_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_close.userData.opacity = v;
			v = v * me._ht_image_close.userData.parentOpacity;
			me._ht_image_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_close.children.length; i++) {
				let child = me._ht_image_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_close.userData.parentOpacity = v;
			v = v * me._ht_image_close.userData.opacity
			me._ht_image_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_close.children.length; i++) {
				let child = me._ht_image_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_close = el;
		el.userData.ggId="ht_image_close";
		me._ht_image_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_image_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_close.ggCurrentLogicStateScaling == 0) {
					me._ht_image_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_image_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_close.scale.set(transition_scale.startScale.x + (me._ht_image_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_image_close.position.x = (me._ht_image_close.position.x - me._ht_image_close.userData.curScaleOffX) + scaleOffX;
						me._ht_image_close.userData.curScaleOffX = scaleOffX;
						me._ht_image_close.position.y = (me._ht_image_close.position.y - me._ht_image_close.userData.curScaleOffY) + scaleOffY;
						me._ht_image_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_image_close.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_image_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_image_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_close.scale.set(transition_scale.startScale.x + (me._ht_image_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_image_close.position.x = (me._ht_image_close.position.x - me._ht_image_close.userData.curScaleOffX) + scaleOffX;
						me._ht_image_close.userData.curScaleOffX = scaleOffX;
						me._ht_image_close.position.y = (me._ht_image_close.position.y - me._ht_image_close.userData.curScaleOffY) + scaleOffY;
						me._ht_image_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_image_close.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_image_close.logicBlock_scaling();
		me._ht_image_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_image_close.material ? me._ht_image_close.material.opacity : me._ht_image_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_image_close.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_image_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_image_close.material ? me._ht_image_close.material.opacity : me._ht_image_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_image_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_image_close.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_image_close.logicBlock_alpha();
		me._ht_image_close.userData.onclick=function (e) {
			player.setVariableValue('vis_image_hotspots', player.getVariableValue('vis_image_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_image_close.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_image_close']=true;
			me._ht_image_close.logicBlock_scaling();
		}
		me._ht_image_close.userData.ontouchend=function (e) {
			me._ht_image_close.logicBlock_scaling();
		}
		me._ht_image_close.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_image_close']=false;
			me._ht_image_close.logicBlock_scaling();
		}
		me._ht_image_close.ggCurrentLogicStateScaling = -1;
		me._ht_image_close.ggCurrentLogicStateAlpha = -1;
		me._ht_image_close.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_image_close']) {
				me.elementMouseOver['ht_image_close']=true;
			}
		}
		me._ht_image_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_image.add(me._ht_image_close);
		me._ht_image.userData.setOpacity(1.00);
		me._ht_image_icon.logicBlock_scaling();
		me._ht_image_icon.logicBlock_visible();
		me._ht_image_icon.userData.setOpacity(1.00);
		me._ht_image_tooltip.logicBlock_visible();
		me._ht_image_tooltip.userData.setOpacity(1.00);
		me._ht_image_bg.logicBlock_scaling();
		me._ht_image_bg.logicBlock_alpha();
		me._ht_image_bg.userData.setOpacity(0.00);
		me._ht_image_img.userData.setOpacity(1.00);
		me._ht_image_close.logicBlock_scaling();
		me._ht_image_close.logicBlock_alpha();
		me._ht_image_close.userData.setOpacity(0.00);
			me.ggEvent_activehotspotchanged=function() {
				me._ht_image_tooltip.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				me._ht_image_icon.logicBlock_visible();
				me._ht_image_tooltip.logicBlock_visible();
				me._ht_image_bg.logicBlock_scaling();
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_close.logicBlock_alpha();
			};
			me.ggEvent_configloaded=function() {
				me._ht_image_icon.logicBlock_visible();
				me._ht_image_tooltip.logicBlock_visible();
				me._ht_image_bg.logicBlock_scaling();
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_close.logicBlock_alpha();
			};
			me.ggEvent_varchanged_vis_image_hotspots=function() {
				me._ht_image_icon.logicBlock_visible();
				me._ht_image_bg.logicBlock_scaling();
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_close.logicBlock_alpha();
			};
			me.__obj = me._ht_image;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_info(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {};
		el.name = 'ht_info';
		el.userData.x = -2;
		el.userData.y = 1;
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_info.visible
			let parentEl = me._ht_info.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info.userData.opacity = v;
			v = v * me._ht_info.userData.parentOpacity;
			me._ht_info.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info.children.length; i++) {
				let child = me._ht_info.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info.userData.parentOpacity = v;
			v = v * me._ht_info.userData.opacity
			me._ht_info.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info.children.length; i++) {
				let child = me._ht_info.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info = el;
		el.userData.ggId="ht_info";
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_info.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.onmouseover=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_info']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.onmouseout=function (e) {
			player.setActiveHotspot(null);
			me.elementMouseOver['ht_info']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_info']) {
				player.setActiveHotspot(me.hotspot);
				me.elementMouseOver['ht_info']=true;
			}
		}
		me._ht_info.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_info_icon_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_info_icon_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_info_icon';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.010);
		el.renderOrder = 1;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_info_icon.material) me._ht_info_icon.material.opacity = v;
			me._ht_info_icon.visible = (v>0 && me._ht_info_icon.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_info_icon.visible
			let parentEl = me._ht_info_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_icon.userData.opacity = v;
			v = v * me._ht_info_icon.userData.parentOpacity;
			me._ht_info_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_icon.children.length; i++) {
				let child = me._ht_info_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_icon.userData.parentOpacity = v;
			v = v * me._ht_info_icon.userData.opacity
			me._ht_info_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_icon.children.length; i++) {
				let child = me._ht_info_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_icon = el;
		el.userData.ggId="ht_info_icon";
		me._ht_info_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_info_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_info_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_info_icon.userData.transitions.length; i++) {
						if (me._ht_info_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_icon.userData.transitions[i].interval);
							me._ht_info_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_info_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_icon.scale.set(transition_scale.startScale.x + (me._ht_info_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_info_icon.position.x = (me._ht_info_icon.position.x - me._ht_info_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_info_icon.userData.curScaleOffX = scaleOffX;
						me._ht_info_icon.position.y = (me._ht_info_icon.position.y - me._ht_info_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_info_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_info_icon.userData.transitions.splice(me._ht_info_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_info_icon.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_info_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_icon.userData.transitions.length; i++) {
						if (me._ht_info_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_icon.userData.transitions[i].interval);
							me._ht_info_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_info_icon.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_icon.scale.set(transition_scale.startScale.x + (me._ht_info_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_info_icon.position.x = (me._ht_info_icon.position.x - me._ht_info_icon.userData.curScaleOffX) + scaleOffX;
						me._ht_info_icon.userData.curScaleOffX = scaleOffX;
						me._ht_info_icon.position.y = (me._ht_info_icon.position.y - me._ht_info_icon.userData.curScaleOffY) + scaleOffY;
						me._ht_info_icon.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_info_icon.userData.transitions.splice(me._ht_info_icon.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_info_icon.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_info_icon.logicBlock_scaling();
		me._ht_info_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_info_icon.visible=false;
			me._ht_info_icon.userData.visible=false;
				}
				else {
			me._ht_info_icon.visible=((!me._ht_info_icon.material && Number(me._ht_info_icon.userData.opacity>0)) || Number(me._ht_info_icon.material.opacity)>0)?true:false;
			me._ht_info_icon.userData.visible=true;
				}
			}
		}
		me._ht_info_icon.logicBlock_visible();
		me._ht_info_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_info_hotspots', player.getVariableValue('vis_info_hotspots') + "<"+me.hotspot.id+">");
		}
		me._ht_info_icon.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_info_icon']=true;
			me._ht_info_tooltip.logicBlock_visible();
			me._ht_info_icon.logicBlock_scaling();
		}
		me._ht_info_icon.userData.ontouchend=function (e) {
			me._ht_info_icon.logicBlock_scaling();
		}
		me._ht_info_icon.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_info_icon']=false;
			me._ht_info_tooltip.logicBlock_visible();
			me._ht_info_icon.logicBlock_scaling();
		}
		me._ht_info_icon.ggCurrentLogicStateScaling = -1;
		me._ht_info_icon.ggCurrentLogicStateVisible = -1;
		me._ht_info_icon.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_info_icon']) {
				me.elementMouseOver['ht_info_icon']=true;
				me._ht_info_tooltip.logicBlock_visible();
			}
		}
		me._ht_info_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(1, 0.22, 5, 5 );
		geometry.name = 'ht_info_tooltip_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_info_tooltip_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_info_tooltip.material.opacity = v;
			if (me._ht_info_tooltip.userData.hasScrollbar) {
				me._ht_info_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_info_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_tooltip.userData.ggSubElement) {
				me._ht_info_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_info_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_info_tooltip.userData.visible);
			}
			me._ht_info_tooltip.visible = (v>0 && me._ht_info_tooltip.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_tooltip.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_tooltip.userData.backgroundColorAlpha = v;
			me._ht_info_tooltip.userData.setOpacity(me._ht_info_tooltip.userData.opacity);
		}
		el.translateX(0);
		el.translateY(-0.365);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_info_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.365;
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_info_tooltip.visible
			let parentEl = me._ht_info_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_tooltip.userData.opacity = v;
			v = v * me._ht_info_tooltip.userData.parentOpacity;
			me._ht_info_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_tooltip.children.length; i++) {
				let child = me._ht_info_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_tooltip.userData.parentOpacity = v;
			v = v * me._ht_info_tooltip.userData.opacity
			me._ht_info_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_tooltip.children.length; i++) {
				let child = me._ht_info_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_tooltip = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(0, 0.666667, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 22;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_info_tooltip.userData.totalHeight = 13;
			me._ht_info_tooltip.userData.textLines = [];
			var ctx = me._ht_info_tooltip.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_info_tooltip.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_info_tooltip.userData.textLines.push(line);
					line = '';
					me._ht_info_tooltip.userData.totalHeight += me._ht_info_tooltip.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_info_tooltip.userData.width - 10 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_info_tooltip.userData.textLines.push(line);
					line = words[i];
					me._ht_info_tooltip.userData.totalHeight += me._ht_info_tooltip.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_info_tooltip.userData.textLines.push(line);
			me._ht_info_tooltip.userData.totalHeight += me._ht_info_tooltip.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_info_tooltip.userData.textCanvas;
			var ctx = me._ht_info_tooltip.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_info_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_info_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_info_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_tooltip.userData.textColor.r * 255 + ', ' + me._ht_info_tooltip.userData.textColor.g * 255 + ', ' + me._ht_info_tooltip.userData.textColor.b * 255 + ', ' + me._ht_info_tooltip.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = (me._ht_info_tooltip.userData.boxWidth - (me._ht_info_tooltip.userData.hasScrollbar ? 25 : 0)) / 2;
			ctx.textAlign = 'center';
			var y = 8;
			for (var i = 0; i < me._ht_info_tooltip.userData.textLines.length; i++) {
				ctx.fillText(me._ht_info_tooltip.userData.textLines[i], x, y);
				y += me._ht_info_tooltip.userData.lineHeight;
			}
			geometry = new THREE.PlaneBufferGeometry(me._ht_info_tooltip.userData.boxWidth / 100.0, me._ht_info_tooltip.userData.boxHeight / 100.0, 5, 5 );
			geometry.name = 'ht_info_tooltip_geometry';
			me._ht_info_tooltip.geometry.dispose();
			me._ht_info_tooltip.geometry = geometry;
			var diffY = me._ht_info_tooltip.userData.boxHeight - me._ht_info_tooltip.userData.height;
			me._ht_info_tooltip.position.y = me._ht_info_tooltip.userData.y - ((diffY / 2.0) / 100.0);
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_tooltip.material.map) {
				me._ht_info_tooltip.material.map.dispose();
			}
			me._ht_info_tooltip.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_info_tooltip.remove(...me._ht_info_tooltip.children);
			var canv = me._ht_info_tooltip.userData.textCanvas;
			var ctx = me._ht_info_tooltip.userData.textCanvasContext;
			ctx.font = '18px Verdana';
			me._ht_info_tooltip.userData.lineHeight = 18 * 1.2;
			me._ht_info_tooltip.userData.textLines = [];
			me._ht_info_tooltip.userData.textLines.push(me._ht_info_tooltip.userData.ggText);
			me._ht_info_tooltip.userData.totalHeight = 13;
			me._ht_info_tooltip.userData.totalHeight += me._ht_info_tooltip.userData.lineHeight;
			me._ht_info_tooltip.userData.boxWidth = ctx.measureText(me._ht_info_tooltip.userData.ggText).width + 10;
			me._ht_info_tooltip.userData.boxHeight = me._ht_info_tooltip.userData.totalHeight;
			canv.width = me._ht_info_tooltip.userData.boxWidth;
			canv.height = me._ht_info_tooltip.userData.boxHeight;
			ctx.font = '18px Verdana';
			me._ht_info_tooltip.userData.ggPaintCanvasText();
		}
		me._ht_info_tooltip.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_info_tooltip.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_info_tooltip.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_info_tooltip.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_tooltip.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_tooltip";
		me._ht_info_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_info_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_info_tooltip.visible=((!me._ht_info_tooltip.material && Number(me._ht_info_tooltip.userData.opacity>0)) || Number(me._ht_info_tooltip.material.opacity)>0)?true:false;
			me._ht_info_tooltip.userData.visible=true;
				}
				else {
			me._ht_info_tooltip.visible=false;
			me._ht_info_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_info_tooltip.logicBlock_visible();
		me._ht_info_tooltip.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info_icon.add(me._ht_info_tooltip);
		me._ht_info.add(me._ht_info_icon);
		geometry = new THREE.PlaneBufferGeometry(3.6, 3.6, 5, 5 );
		geometry.name = 'ht_info_bg_geometry';
		material = new THREE.MeshBasicMaterial( { color: new THREE.Color('rgba(0,170,255,0.784314)').convertSRGBToLinear(), side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_info_bg_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 0.784314;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_info_bg.material.opacity = v * me._ht_info_bg.userData.backgroundColorAlpha;
			if (me._ht_info_bg.userData.ggSubElement) {
				me._ht_info_bg.userData.ggSubElement.material.opacity = v
				me._ht_info_bg.userData.ggSubElement.visible = (v>0 && me._ht_info_bg.userData.visible);
			}
			me._ht_info_bg.visible = (v>0 && me._ht_info_bg.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_bg.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_bg.userData.backgroundColorAlpha = v;
			me._ht_info_bg.userData.setOpacity(me._ht_info_bg.userData.opacity);
		}
		el.translateX(0);
		el.translateY(1.782);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 360;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.782;
		el.name = 'ht_info_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.translateZ(0.020);
		el.renderOrder = 2;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_info_bg.visible
			let parentEl = me._ht_info_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_bg.userData.opacity = v;
			v = v * me._ht_info_bg.userData.parentOpacity;
			me._ht_info_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_bg.children.length; i++) {
				let child = me._ht_info_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_bg.userData.parentOpacity = v;
			v = v * me._ht_info_bg.userData.opacity
			me._ht_info_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_bg.children.length; i++) {
				let child = me._ht_info_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_bg = el;
		el.userData.ggId="ht_info_bg";
		me._ht_info_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_info_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_info_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_bg.scale.set(transition_scale.startScale.x + (me._ht_info_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_info_bg.position.x = (me._ht_info_bg.position.x - me._ht_info_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_info_bg.userData.curScaleOffX = scaleOffX;
						me._ht_info_bg.position.y = (me._ht_info_bg.position.y - me._ht_info_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_info_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_info_bg.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_info_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_info_bg.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_bg.scale.set(transition_scale.startScale.x + (me._ht_info_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_info_bg.position.x = (me._ht_info_bg.position.x - me._ht_info_bg.userData.curScaleOffX) + scaleOffX;
						me._ht_info_bg.userData.curScaleOffX = scaleOffX;
						me._ht_info_bg.position.y = (me._ht_info_bg.position.y - me._ht_info_bg.userData.curScaleOffY) + scaleOffY;
						me._ht_info_bg.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_info_bg.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_info_bg.logicBlock_scaling();
		me._ht_info_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_info_bg.material ? me._ht_info_bg.material.opacity : me._ht_info_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_info_bg.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_info_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_info_bg.material ? me._ht_info_bg.material.opacity : me._ht_info_bg.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_info_bg.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_info_bg.logicBlock_alpha();
		me._ht_info_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneBufferGeometry(3.4, 3.1, 5, 5 );
		geometry.name = 'ht_info_text_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_info_text_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 1;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_info_text.material.opacity = v;
			if (me._ht_info_text.userData.hasScrollbar) {
				me._ht_info_text.userData.scrollbar.material.opacity = v;
				me._ht_info_text.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_text.userData.ggSubElement) {
				me._ht_info_text.userData.ggSubElement.material.opacity = v
				me._ht_info_text.userData.ggSubElement.visible = (v>0 && me._ht_info_text.userData.visible);
			}
			me._ht_info_text.visible = (v>0 && me._ht_info_text.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_text.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_text.userData.backgroundColorAlpha = v;
			me._ht_info_text.userData.setOpacity(me._ht_info_text.userData.opacity);
		}
		el.translateX(0);
		el.translateY(-0.15);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 310;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_info_text';
		el.userData.x = 0;
		el.userData.y = -0.15;
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_info_text.visible
			let parentEl = me._ht_info_text.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_text.userData.opacity = v;
			v = v * me._ht_info_text.userData.parentOpacity;
			me._ht_info_text.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_text.children.length; i++) {
				let child = me._ht_info_text.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_text.userData.parentOpacity = v;
			v = v * me._ht_info_text.userData.opacity
			me._ht_info_text.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_text.children.length; i++) {
				let child = me._ht_info_text.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_text = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(1, 1, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 340;
		canvas.height = 310;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_info_text.userData.totalHeight = 3;
			me._ht_info_text.userData.textLines = [];
			var ctx = me._ht_info_text.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_info_text.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_info_text.userData.textLines.push(line);
					line = '';
					me._ht_info_text.userData.totalHeight += me._ht_info_text.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_info_text.userData.width - 0 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_info_text.userData.textLines.push(line);
					line = words[i];
					me._ht_info_text.userData.totalHeight += me._ht_info_text.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_info_text.userData.textLines.push(line);
			me._ht_info_text.userData.totalHeight += me._ht_info_text.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_info_text.userData.textCanvas;
			var ctx = me._ht_info_text.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_text.userData.textColor.r * 255 + ', ' + me._ht_info_text.userData.textColor.g * 255 + ', ' + me._ht_info_text.userData.textColor.b * 255 + ', ' + me._ht_info_text.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = 0;
			ctx.textAlign = 'left';
			var y = 3;
			y -= me._ht_info_text.userData.scrollPosPercent * me._ht_info_text.userData.totalHeight;
			for (var i = 0; i < me._ht_info_text.userData.textLines.length; i++) {
				ctx.fillText(me._ht_info_text.userData.textLines[i], x, y);
				y += me._ht_info_text.userData.lineHeight;
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_text_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_text.material.map) {
				me._ht_info_text.material.map.dispose();
			}
			me._ht_info_text.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_info_text.remove(...me._ht_info_text.children);
			var canv = me._ht_info_text.userData.textCanvas;
			var ctx = me._ht_info_text.userData.textCanvasContext;
			ctx.font = '18px Verdana';
			me._ht_info_text.userData.lineHeight = 18 * 1.2;
			me._ht_info_text.userData.ggWrapText(false);
			me._ht_info_text.userData.boxWidth = me._ht_info_text.userData.width;
			me._ht_info_text.userData.boxHeight = me._ht_info_text.userData.height;
			me._ht_info_text.userData.scrollPosPercent = 0.0
			if (me._ht_info_text.userData.totalHeight > me._ht_info_text.userData.height) {
				me._ht_info_text.userData.ggWrapText(true);
				me._ht_info_text.userData.pagePercent = me._ht_info_text.userData.height / me._ht_info_text.userData.totalHeight;
				me._ht_info_text.userData.maxScrollPercent = (me._ht_info_text.userData.totalHeight - me._ht_info_text.userData.height) / me._ht_info_text.userData.totalHeight;
				geometry = new THREE.PlaneBufferGeometry(25 / 100.0, me._ht_info_text.userData.height / 100.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarBgGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x7f7f7f, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarBgMaterial';
				me._ht_info_text.userData.scrollbarBg = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbarBg.name = 'ht_info_text_scrollbarBg';
				me._ht_info_text.add(me._ht_info_text.userData.scrollbarBg);
				me._ht_info_text.userData.scrollbarXPos = (me._ht_info_text.userData.width - 25) / 200.0;
				me._ht_info_text.userData.scrollbarBg.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbarBg.position.z = me._ht_info_text.position.z + 0.01;
				me._ht_info_text.userData.scrollbarBg.userData.stopPropagation = true;
				me._ht_info_text.userData.scrollbarHeight = (me._ht_info_text.userData.height / me._ht_info_text.userData.totalHeight) * me._ht_info_text.userData.height;
				geometry = new THREE.PlaneBufferGeometry(25 / 100.0, me._ht_info_text.userData.scrollbarHeight / 100.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0xbfbfbf, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarMaterial';
				me._ht_info_text.userData.scrollbar = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbar.name = 'ht_info_text_scrollbar';
				me._ht_info_text.add(me._ht_info_text.userData.scrollbar);
				me._ht_info_text.userData.scrollbar.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbar.position.z = me._ht_info_text.position.z + 0.02;
				me._ht_info_text.userData.scrollbarYPosMin = (me._ht_info_text.userData.height - me._ht_info_text.userData.scrollbarHeight) / 200.0;
				me._ht_info_text.userData.scrollbarYPosMax = me._ht_info_text.userData.scrollbarYPosMin - (me._ht_info_text.userData.height - me._ht_info_text.userData.scrollbarHeight) / 100.0;
				me._ht_info_text.userData.scrollbar.position.y = me._ht_info_text.userData.scrollbarYPosMin;
				geometry = new THREE.PlaneBufferGeometry(25 / 100.0, me._ht_info_text.userData.height / 200.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarPageDownGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarPageDownMaterial';
				me._ht_info_text.userData.scrollbarPageDown = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbarPageDown.name = 'ht_info_text_scrollbarPageDown';
				me._ht_info_text.userData.scrollbarPageDown.userData.onclick = function() {
					me._ht_info_text.userData.scrollPosPercent -= me._ht_info_text.userData.pagePercent;
					me._ht_info_text.userData.scrollPosPercent = Math.max(me._ht_info_text.userData.scrollPosPercent, 0);
					me._ht_info_text.userData.ggPaintCanvasText();
					me._ht_info_text.userData.scrollbar.position.y += (me._ht_info_text.userData.height * me._ht_info_text.userData.pagePercent) / 100.0;
					me._ht_info_text.userData.scrollbar.position.y = Math.min(me._ht_info_text.userData.scrollbar.position.y, me._ht_info_text.userData.scrollbarYPosMin);
				}
				me._ht_info_text.userData.scrollbarPageDown.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbarPageDown.position.y = me._ht_info_text.userData.height / 400.0;
				me._ht_info_text.userData.scrollbarPageDown.position.z = me._ht_info_text.position.z + 0.05;
				me._ht_info_text.userData.scrollbarPageDown.userData.stopPropagation = true;
				me._ht_info_text.userData.scrollbarPageDown.userData.clickInvisible = true;
				me._ht_info_text.userData.scrollbarPageDown.visible = false;
				me._ht_info_text.add(me._ht_info_text.userData.scrollbarPageDown);
				geometry = new THREE.PlaneBufferGeometry(25 / 100.0, me._ht_info_text.userData.height / 200.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarPageUpGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarPageUpMaterial';
				me._ht_info_text.userData.scrollbarPageUp = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbarPageUp.name = 'ht_info_text_scrollbarPageUp';
				me._ht_info_text.userData.scrollbarPageUp.userData.onclick = function() {
					me._ht_info_text.userData.scrollPosPercent += me._ht_info_text.userData.pagePercent;
					me._ht_info_text.userData.scrollPosPercent = Math.min(me._ht_info_text.userData.scrollPosPercent, me._ht_info_text.userData.maxScrollPercent);
					me._ht_info_text.userData.ggPaintCanvasText();
					me._ht_info_text.userData.scrollbar.position.y -= (me._ht_info_text.userData.height * me._ht_info_text.userData.pagePercent) / 100.0;
					me._ht_info_text.userData.scrollbar.position.y = Math.max(me._ht_info_text.userData.scrollbar.position.y, me._ht_info_text.userData.scrollbarYPosMax);
				}
				me._ht_info_text.userData.scrollbarPageUp.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbarPageUp.position.y = -me._ht_info_text.userData.height / 400.0;
				me._ht_info_text.userData.scrollbarPageUp.position.z = me._ht_info_text.position.z + 0.05;
				me._ht_info_text.userData.scrollbarPageUp.userData.stopPropagation = true;
				me._ht_info_text.userData.scrollbarPageUp.userData.clickInvisible = true;
				me._ht_info_text.userData.scrollbarPageUp.visible = false;
				me._ht_info_text.add(me._ht_info_text.userData.scrollbarPageUp);
				me._ht_info_text.userData.hasScrollbar = true;
			} else {
				me._ht_info_text.userData.hasScrollbar = false;
			}
			canv.width = me._ht_info_text.userData.boxWidth;
			canv.height = me._ht_info_text.userData.boxHeight;
			ctx.font = '18px Verdana';
			me._ht_info_text.userData.ggPaintCanvasText();
		}
		me._ht_info_text.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.description))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_info_text.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_info_text.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_info_text.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_text.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_text.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_text.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_text.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_text";
		me._ht_info_text.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info_bg.add(me._ht_info_text);
		geometry = new THREE.PlaneBufferGeometry(3.4, 0.25, 5, 5 );
		geometry.name = 'ht_info_title_geometry';
		material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : true } ); 
		material.name = 'ht_info_title_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.backgroundColorAlpha = 1;
		el.userData.borderColorAlpha = 1;
		el.userData.setOpacityInternal = function(v) {
			me._ht_info_title.material.opacity = v;
			if (me._ht_info_title.userData.hasScrollbar) {
				me._ht_info_title.userData.scrollbar.material.opacity = v;
				me._ht_info_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_title.userData.ggSubElement) {
				me._ht_info_title.userData.ggSubElement.material.opacity = v
				me._ht_info_title.userData.ggSubElement.visible = (v>0 && me._ht_info_title.userData.visible);
			}
			me._ht_info_title.visible = (v>0 && me._ht_info_title.userData.visible);
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_title.material.color = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_title.userData.backgroundColorAlpha = v;
			me._ht_info_title.userData.setOpacity(me._ht_info_title.userData.opacity);
		}
		el.translateX(0);
		el.translateY(1.565);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 25;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_info_title';
		el.userData.x = 0;
		el.userData.y = 1.565;
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.translateZ(0.040);
		el.renderOrder = 4;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.isVisible = function() {
			let vis = me._ht_info_title.visible
			let parentEl = me._ht_info_title.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_title.userData.opacity = v;
			v = v * me._ht_info_title.userData.parentOpacity;
			me._ht_info_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_title.children.length; i++) {
				let child = me._ht_info_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_title.userData.parentOpacity = v;
			v = v * me._ht_info_title.userData.opacity
			me._ht_info_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_title.children.length; i++) {
				let child = me._ht_info_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_title = el;
		el.userData.textLines = [];
		el.userData.backgroundColor = new THREE.Color(1, 1, 1);
		el.userData.textColor = new THREE.Color(1, 1, 1);
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 340;
		canvas.height = 25;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		el.userData.ggStripTags = function(text) {
			let doc = new DOMParser().parseFromString(text, 'text/html');
			return doc.body.textContent || '';
		}
		el.userData.ggWrapText = function(scrollbar) {
			me._ht_info_title.userData.totalHeight = 3;
			me._ht_info_title.userData.textLines = [];
			var ctx = me._ht_info_title.userData.textCanvasContext;
			var words = [];
			let tmpText = String(me._ht_info_title.userData.ggText);
			let whiteSpaceIndex = -1;
			do {
				whiteSpaceIndex = tmpText.search(/[\s]/);
				if (whiteSpaceIndex != -1) {
					words.push(tmpText.substr(0, whiteSpaceIndex));
					tmpText = tmpText.substr(whiteSpaceIndex);
					if (tmpText.charAt(0) == '\n') {
						words.push('\n');
					}
					tmpText = tmpText.substr(1);
				} else {
					words.push(tmpText);
				}
			} while (whiteSpaceIndex != -1);
			var line = '';
			for (var i = 0; i < words.length; i++) {
				if (words[i] == '\n') {
					me._ht_info_title.userData.textLines.push(line);
					line = '';
					me._ht_info_title.userData.totalHeight += me._ht_info_title.userData.lineHeight;
					continue;
				}
				var testLine;
				if (line == '') {
					testLine = words[i]
				} else {
					testLine = line + ' ' + words[i];
				}
				var metrics = ctx.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > (me._ht_info_title.userData.width - 0 - (scrollbar ? 25 : 0)) && i > 0) {
					me._ht_info_title.userData.textLines.push(line);
					line = words[i];
					me._ht_info_title.userData.totalHeight += me._ht_info_title.userData.lineHeight;
				} else {
					line = testLine;
				}
			}
			me._ht_info_title.userData.textLines.push(line);
			me._ht_info_title.userData.totalHeight += me._ht_info_title.userData.lineHeight;
		}
		el.userData.ggPaintCanvasText = function() {
			var canv = me._ht_info_title.userData.textCanvas;
			var ctx = me._ht_info_title.userData.textCanvasContext;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_title.userData.textColor.r * 255 + ', ' + me._ht_info_title.userData.textColor.g * 255 + ', ' + me._ht_info_title.userData.textColor.b * 255 + ', ' + me._ht_info_title.userData.textColorAlpha + ')';
			ctx.textBaseline = 'top';
			var x = (me._ht_info_title.userData.boxWidth - (me._ht_info_title.userData.hasScrollbar ? 25 : 0)) / 2;
			ctx.textAlign = 'center';
			var y = 3;
			for (var i = 0; i < me._ht_info_title.userData.textLines.length; i++) {
				var curTextLine = me._ht_info_title.userData.textLines[i];
				var curTextLineBase = me._ht_info_title.userData.textLines[i];
				if ((ctx.measureText(curTextLine).width + x + 0) > canv.width) {
					var cutChars = 0;
					do {
						cutChars++;
						curTextLine = curTextLineBase.substring(0, curTextLineBase.length - cutChars) + '...';
					} while (cutChars < curTextLineBase.length && (ctx.measureText(curTextLine).width + x + 0) > canv.width);
				}
				ctx.fillText(curTextLine, x, y);
				y += me._ht_info_title.userData.lineHeight;
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.encoding = THREE.sRGBEncoding;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_title.material.map) {
				me._ht_info_title.material.map.dispose();
			}
			me._ht_info_title.material.map = textTexture;
		}
		el.userData.ggRenderText = function() {
			me._ht_info_title.remove(...me._ht_info_title.children);
			var canv = me._ht_info_title.userData.textCanvas;
			var ctx = me._ht_info_title.userData.textCanvasContext;
			ctx.font = '22px Verdana';
			me._ht_info_title.userData.lineHeight = 22 * 1.2;
			me._ht_info_title.userData.textLines = [];
			me._ht_info_title.userData.textLines.push(me._ht_info_title.userData.ggText);
			me._ht_info_title.userData.totalHeight = 3;
			me._ht_info_title.userData.totalHeight += me._ht_info_title.userData.lineHeight;
			me._ht_info_title.userData.boxWidth = me._ht_info_title.userData.width;
			me._ht_info_title.userData.boxHeight = me._ht_info_title.userData.height;
			me._ht_info_title.userData.hasScrollbar = false;
			canv.width = me._ht_info_title.userData.boxWidth;
			canv.height = me._ht_info_title.userData.boxHeight;
			ctx.font = '22px Verdana';
			me._ht_info_title.userData.ggPaintCanvasText();
		}
		me._ht_info_title.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=me._ht_info_title.userData.ggStripTags(hs);
				this.ggRenderText();
			}
		}
		me._ht_info_title.userData.ggUpdateText();
		player.addListener('changenode', function() {
			me._ht_info_title.userData.ggUpdateText();
		});
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_title.userData.textColor = v;
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_title";
		me._ht_info_title.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info_bg.add(me._ht_info_title);
		me._ht_info.add(me._ht_info_bg);
		geometry = new THREE.PlaneBufferGeometry(0.45, 0.45, 5, 5 );
		geometry.name = 'ht_info_close_geometry';
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,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');
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_info_close_material';
		el = new THREE.Mesh( geometry, material );
		el.userData.materialNormal = material;
		el.translateX(2.1);
		el.translateY(1.575);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.name = 'ht_info_close';
		el.userData.x = 2.1;
		el.userData.y = 1.575;
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.translateZ(0.030);
		el.renderOrder = 3;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_info_close.material) me._ht_info_close.material.opacity = v;
			me._ht_info_close.visible = (v>0 && me._ht_info_close.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_info_close.visible
			let parentEl = me._ht_info_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_close.userData.opacity = v;
			v = v * me._ht_info_close.userData.parentOpacity;
			me._ht_info_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_close.children.length; i++) {
				let child = me._ht_info_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_close.userData.parentOpacity = v;
			v = v * me._ht_info_close.userData.opacity
			me._ht_info_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_close.children.length; i++) {
				let child = me._ht_info_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_close = el;
		el.userData.ggId="ht_info_close";
		me._ht_info_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_info_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_close.ggCurrentLogicStateScaling == 0) {
					me._ht_info_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_info_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_close.scale.set(transition_scale.startScale.x + (me._ht_info_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_info_close.position.x = (me._ht_info_close.position.x - me._ht_info_close.userData.curScaleOffX) + scaleOffX;
						me._ht_info_close.userData.curScaleOffX = scaleOffX;
						me._ht_info_close.position.y = (me._ht_info_close.position.y - me._ht_info_close.userData.curScaleOffY) + scaleOffY;
						me._ht_info_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_info_close.userData.transitions.push(transition_scale);
				}
				else {
					me._ht_info_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_scale = {};
					transition_scale.property = 'scale';
					transition_scale.startTime = Date.now();
					transition_scale.startScale = me._ht_info_close.scale;
					transition_scale.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_close.scale.set(transition_scale.startScale.x + (me._ht_info_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
						me._ht_info_close.position.x = (me._ht_info_close.position.x - me._ht_info_close.userData.curScaleOffX) + scaleOffX;
						me._ht_info_close.userData.curScaleOffX = scaleOffX;
						me._ht_info_close.position.y = (me._ht_info_close.position.y - me._ht_info_close.userData.curScaleOffY) + scaleOffY;
						me._ht_info_close.userData.curScaleOffY = scaleOffY;
						if (percentDone >= 1.0) {
							clearInterval(transition_scale.interval);
							me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_scale), 1);
						}
					}, 20);
					me._ht_info_close.userData.transitions.push(transition_scale);
				}
			}
		}
		me._ht_info_close.logicBlock_scaling();
		me._ht_info_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_info_close.material ? me._ht_info_close.material.opacity : me._ht_info_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_info_close.userData.transitions.push(transition_alpha);
				}
				else {
					me._ht_info_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					let transition_alpha = {};
					transition_alpha.property = 'alpha';
					transition_alpha.startTime = Date.now();
					transition_alpha.startAlpha = me._ht_info_close.material ? me._ht_info_close.material.opacity : me._ht_info_close.userData.opacity;
					transition_alpha.interval = setInterval(() => {
						let currentTime = Date.now() - 0;
						let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
						percentDone = Math.max(percentDone, 0.0);
						percentDone = Math.min(percentDone, 1.0);
						let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
						me._ht_info_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
						if (percentDone >= 1.0) {
							clearInterval(transition_alpha.interval);
							me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_alpha), 1);
						}
					}, 20);
					me._ht_info_close.userData.transitions.push(transition_alpha);
				}
			}
		}
		me._ht_info_close.logicBlock_alpha();
		me._ht_info_close.userData.onclick=function (e) {
			player.setVariableValue('vis_info_hotspots', player.getVariableValue('vis_info_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_info_close.userData.onmouseover=function (e) {
			me.elementMouseOver['ht_info_close']=true;
			me._ht_info_close.logicBlock_scaling();
		}
		me._ht_info_close.userData.ontouchend=function (e) {
			me._ht_info_close.logicBlock_scaling();
		}
		me._ht_info_close.userData.onmouseout=function (e) {
			me.elementMouseOver['ht_info_close']=false;
			me._ht_info_close.logicBlock_scaling();
		}
		me._ht_info_close.ggCurrentLogicStateScaling = -1;
		me._ht_info_close.ggCurrentLogicStateAlpha = -1;
		me._ht_info_close.userData.ggUpdateConditionTimer=function () {
			if (me.elementMouseOver['ht_info_close']) {
				me.elementMouseOver['ht_info_close']=true;
			}
		}
		me._ht_info_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info.add(me._ht_info_close);
		me._ht_info.userData.setOpacity(1.00);
		me._ht_info_icon.logicBlock_scaling();
		me._ht_info_icon.logicBlock_visible();
		me._ht_info_icon.userData.setOpacity(1.00);
		me._ht_info_tooltip.logicBlock_visible();
		me._ht_info_tooltip.userData.setOpacity(1.00);
		me._ht_info_bg.logicBlock_scaling();
		me._ht_info_bg.logicBlock_alpha();
		me._ht_info_bg.userData.setOpacity(0.00);
		me._ht_info_text.userData.setOpacity(1.00);
		me._ht_info_title.userData.setOpacity(1.00);
		me._ht_info_close.logicBlock_scaling();
		me._ht_info_close.logicBlock_alpha();
		me._ht_info_close.userData.setOpacity(0.00);
			me.ggEvent_activehotspotchanged=function() {
				me._ht_info_tooltip.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				me._ht_info_icon.logicBlock_visible();
				me._ht_info_tooltip.logicBlock_visible();
				me._ht_info_bg.logicBlock_scaling();
				me._ht_info_bg.logicBlock_alpha();
				me._ht_info_close.logicBlock_alpha();
			};
			me.ggEvent_configloaded=function() {
				me._ht_info_icon.logicBlock_visible();
				me._ht_info_tooltip.logicBlock_visible();
				me._ht_info_bg.logicBlock_scaling();
				me._ht_info_bg.logicBlock_alpha();
				me._ht_info_close.logicBlock_alpha();
			};
			me.ggEvent_varchanged_vis_info_hotspots=function() {
				me._ht_info_icon.logicBlock_visible();
				me._ht_info_bg.logicBlock_scaling();
				me._ht_info_bg.logicBlock_alpha();
				me._ht_info_close.logicBlock_alpha();
			};
			me.__obj = me._ht_info;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	me.addSkinHotspot=function(hotspot) {
		var hsinst = null;
		if (hotspot.skinid=='ht_info') {
			hotspot.skinid = 'ht_info';
			hsinst = new SkinHotspotClass_ht_info(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty(hotspot.skinid)) {
				hotspotTemplates[hotspot.skinid] = [];
			}
			hotspotTemplates[hotspot.skinid].push(hsinst);
		} else
		if (hotspot.skinid=='ht_image') {
			hotspot.skinid = 'ht_image';
			hsinst = new SkinHotspotClass_ht_image(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty(hotspot.skinid)) {
				hotspotTemplates[hotspot.skinid] = [];
			}
			hotspotTemplates[hotspot.skinid].push(hsinst);
		} else
		if (hotspot.skinid=='ht_node') {
			hotspot.skinid = 'ht_node';
			hsinst = new SkinHotspotClass_ht_node(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty(hotspot.skinid)) {
				hotspotTemplates[hotspot.skinid] = [];
			}
			hotspotTemplates[hotspot.skinid].push(hsinst);
		} else
		if (hotspot.skinid=='ht_video_file') {
			hotspot.skinid = 'ht_video_file';
			hsinst = new SkinHotspotClass_ht_video_file(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty(hotspot.skinid)) {
				hotspotTemplates[hotspot.skinid] = [];
			}
			hotspotTemplates[hotspot.skinid].push(hsinst);
		} else
		if (hotspot.skinid=='ht_video_url') {
			hotspot.skinid = 'ht_video_url';
			hsinst = new SkinHotspotClass_ht_video_url(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty(hotspot.skinid)) {
				hotspotTemplates[hotspot.skinid] = [];
			}
			hotspotTemplates[hotspot.skinid].push(hsinst);
		}
		return (hsinst ? hsinst.__obj : null);
	}
	me.removeSkinHotspots=function() {
		hotspotTemplates = [];
	}
	player.addListener('changenode', function() {
		me.ggUserdata=player.userdata;
	});
	me.skinTimerEvent=function() {
	if (!player.isInVR()) return;
		me.ggCurrentTime=new Date().getTime();
		me._page_up.userData.ggUpdateConditionTimer();
		me._page_down.userData.ggUpdateConditionTimer();
	};
	player.addListener('timer', me.skinTimerEvent);
	player.addListener('entervr', function() { me.addSkin(); player.triggerEvent('changenode'); });
	player.addListener('exitvr', function() { me.removeSkin(); });
	me.skinTimerEvent();
};