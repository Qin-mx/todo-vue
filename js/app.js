(function(window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	var filters = {
		all: function(list) {
			return list;
		},
		active: function(list) {
			return list.filter(function(list) {
				return !list.completed; //将已将完成的过滤掉，剩下未完成的
			});
		},
		completed: function(list) {
			return list.filter(function(list) {
				return list.completed;
			});
		}
	};
	//	判断是否有本地数据
	var STORAGE_KEY = 'todos-vuejs';

	var todoStorage = {
		fetch: function() {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function(todos) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		}
	};

	//	创建vue实例化对象
	var app = new Vue({
		el: '.todoapp',
		data: {
			msg: '',
			editing: '',
			visibility: 'all', //当前显示
			list: todoStorage.fetch()
		},
		//	计算属性
		computed: {
			//		剩下的 除去已完成的
			remaining() {
				return filters.active(this.list).length;
			},
			//			下拉显示
			allDone: {
				get: function() {
					return this.remaining === 0;
				},
				set: function(value) {
					console.log(value)
					this.list.forEach(function(todo) {
						todo.completed = value;
					});
				}
			},
			filteredTodos: function() {
				//				计算属性  进行判断，判断当前任务状态，判断剩下的list
				return filters[this.visibility](this.list);
			},
		},
		watch: {
			list: {
				deep: true,
				handler: todoStorage.save
			}
		},
		methods: {
			//		添加事件
			add: function(e) {
				if(this.msg) { //判断是否有值
					this.list.push({
						text: this.msg,
						completed: false
					})
				}
				this.msg = '';

			},
			//		删除事件
			destroy(item) {
				var index = this.list.indexOf(item);
				this.list.splice(index, 1);
			},
			//		编辑事件
			editTodo(item) {
				//			设置一个参数保存现在的值
				this.beforeedit = item.text;
				this.editing = item
			},
			doneEdit(item) {
				//			先判断是否
				if(!this.editing) return;
				item = this.editing
				this.editing = ''
				if(!item.text) {
					this.destroy(item)
				}
			},
			cancelEdit(item) {
				//			返回以前的值
				this.editing = ''
				item.text = this.beforeedit;
			},
			//清楚完成的事件
			clearCompleted() {
				//			调用定义的过滤 将完成的项目从list中去除
				this.list = filters.active(this.list)
			}
			//切换完成事件
			//显示所有事件
			//显示为完成事件
		},
		//	定义组件
		directives: {
			'edit-focus' (el, binding) {
				if(binding.value) {
					el.focus()
				}
			}
		}
	})
	//	路由
//	var router = new Router();
//
//	['all', 'active', 'completed'].forEach(function(visibility) {
//		router.on(visibility, function() {
//			app.visibility = visibility;
//		});
//	});
//
//	router.configure({
//		notfound: function() {
//			window.location.hash = '';
//			app.visibility = 'all';
//		}
//	});
//
//	router.init();
function router () {
	var str  = location.hash;
//	console.log(str)
//处理获取的str
 	str = str.slice(2);
 	console.log(str)
 	// 映射列表
	var map = ['all', 'active', 'completed'];
	if( str ) {
		app.visibility = str;
	}else{
		app.visibility = map[0];
	}
}
window.addEventListener('load',router);
// hash改变事件叫hashchange
window.addEventListener('hashchange',router);
})(window);