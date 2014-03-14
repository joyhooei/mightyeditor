MT.requireFile("js/phaser.js");
MT.require("core.Helper");

MT(
	MT.plugins.MapEditor = function(project){
		this.selectedObject = null;
		var that = this;
		this.project = project;
		
		this.assets = [];
		this.objects = [];
	},
	{
		
		createMap: function(){
			
			if(this.game){
				this.game.canvas.parentNode.removeChild(this.game.canvas);
				this.game.destroy();
			}
			
			var that = this;
			
			console.log("new map loaded");
			var that = this;
			
			var game = this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { 
				preload: function(){
					var c = game.canvas;
					c.parentNode.removeChild(c);
					that.project.ui.center.appendChild(c);
					that.resize();
				},
				create: function(){
					/*game.input.onDown.add(doSomething, this);

					function doSomething() {
						console.log("down", this, arguments)
					}*/
				}
			});
			
			
			
		},
		
		_addTimeout: 0,
		addObjects: function(objs){
			if(!this.isAssetsAdded){
				var that = this;
				if(this._addTimeout){
					window.clearTimeout(this._addTimeout);
				}
				
				this._addTimeout = window.setTimeout(function(){
					that.addObjects(objs);
				}, 100);
				return;
			}
			
			//reverse order
			for(var i=this.objects.length-1; i>-1; i--){
				this.objects[i].destroy();
			}
			this.objects.length = 0;
			for(var i=objs.length-1; i>-1; i--){
				if(objs[i].contents){
					continue;
				}
				this.addObject(objs[i]);
			}
			
		},
		
		addAssets: function(assets){
			var game = this.game;
			var that = this;
			var asset = null;
			var cnt = assets.length;
			this.isAssetsAdded = false;
			for(var i=0; i<assets.length; i++){
				this.addAsset(assets[i], function(){
					cnt--;
					if(cnt == 0){
						that.isAssetsAdded = true;
					}
				});
			}
		},
		
		
   
		addAsset: function(asset, cb){
			if(asset.contents){
				this.addAssets(asset.contents);
				return;
			}
			
			var game = this.game;
			var path = this.project.path + asset.fullPath;
			if(!MT.core.Helper.isImage(path)){
				if(typeof cb === "function"){
					cb();
				}
				return;
			}
			
			
			var image = new Image();
			image.onload = function(){
				game.cache.addImage(path, path, this);
				if(typeof cb === "function"){
					cb();
				}
			};
			image.src = path;
		},
   
   
		addObject: function(obj){
			
			
			var game = this.game;
			var that = this;
			if(obj.contents){
				console.log("group selected");
				return;
			}
			
			if(game.cache){
				console.log(game.cache);
			}
			
			var sp = game.add.sprite(obj.x, obj.y, obj.image)
			that.objects.push(sp);
			
			sp.inputEnabled = true;
			sp.input.enableDrag();
			sp.events.onDragStop.add(function(sprite, ev){
				console.log("stopped", sprite, ev);
				obj.x = sprite.x;
				obj.y = sprite.y;
				that.project.om.updateData();
			});
			
			
			
			
		},
   
		resize: function(){
			if(!this.game){
				return;
			}
			this.game.width = this.project.ui.center.offsetWidth;
			this.game.height = this.project.ui.center.offsetHeight;
			this.game.stage.bounds.width = this.game.width;
			this.game.stage.bounds.height = this.game.height;
			
			if (this.game.renderType === Phaser.WEBGL){
				this.game.renderer.resize(this.game.width, this.game.height);
			}
		},
   
   
		initUI: function(ui){
			var that = this;
			this.project.ui.onResize(function(){
				that.resize();
			});
			this.createMap();
			
			this.project.am.onUpdate(function(data){
				that.addAssets(data);
			});
			
		},
   
		move: function(){
			
			
		}
		
		
		
		
		
		
		
		
		
	}
);   
