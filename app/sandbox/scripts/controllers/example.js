// Copyright © Citrix Systems, Inc.  All rights reserved.
'use strict';

app.controller('ExampleController', [
	'$modal',
	'$rootScope',
	'$scope',
	'$state',
	'$window',
    function ($modal, $rootScope, $scope, $state, $window) {
        $(document).ready(function() {
        	// Destroy Fullpage
			if (typeof $.fn.fullpage.destroy === 'function') { 
			    $.fn.fullpage.destroy('all');
			}
		});
		$scope.openChart = function(index) {
			$rootScope.chartIndex = index;
	        $modal.open({
	            templateUrl: 'sandbox/views/chart-detail.html',
	            controller: 'DetailController'
	        });
	    };
	    $scope.packConfig1 = {
			data: 
				{
					"name":"Asphalt",
					"children":
					[
						{ 
						  "name":"A" , 
					  	  "children":
					  	  [
						  	  	{"name":"After" },
						  	  	{"name":"About" },
						  	  	{"name":"Abort" },
						  	  	{"name":"Afraid" }
					  	  ] 
					  	},
						{ 
							"name":"B" , 
							"children":
							[
								{"name":"Blue"},
								{"name":"Bring"},
								{"name":"Beside"},
								{"name":"Bottom"},
								{"name":"Be"},
								{"name":"Bing"}
							]
						},
						{ 
							"name":"C" , 
							"children":
							[
								{"name":"Chart"},
								{"name":"Citrix"},
								{"name":"Copy"},
								{"name":"Config"},
								{"name":"Con"},
								{"name":"Clone"},
								{"name":"Cride"}
							]
						},
						{ 
							"name":"D" , 
							"children":
							[
								{"name":"Define"},
								{"name":"Degree"},
								{"name":"Decide"},
								{"name":"Dior"},
								{"name":"Did"},
								{"name":"Do"}
							]
						},
						{ 
							"name":"E" , 
							"children":
							[
								{"name":"Energy"},
								{"name":"En"},
								{"name":"Enough"},
								{"name":"Eroll"}
							]
						},
						{ 
							"name":"F" , 
							"children":
							[
								{"name":"Flag"},
								{"name":"Fly"},
								{"name":"Flow"},
								{"name":"Feel"},
								{"name":"For"},
								{"name":"Fing"}
							]
						},
						{ 
							"name":"G" , 
							"children":
							[
								{"name":"Green"},
								{"name":"Glue"},
								{"name":"Gary"},
								{"name":"Goal"},
								{"name":"Go"}
							]
						}
					]
				},
			radius: 23,
			margin: { left: 50, top: 20, right: 50, bottom: 20 }
		};
	    $scope.packConfig2 = {
			data: 
				{
					"name":"中国",
					"children":
					[
						{ 
						  "name":"浙江" , 
					  	  "children":
					  	  [
						  	  	{"name":"杭州" },
						  	  	{"name":"宁波" },
						  	  	{"name":"温州" },
						  	  	{"name":"绍兴" }
					  	  ] 
					  	},
						{ 
							"name":"广西" , 
							"children":
							[
								{"name":"桂林"},
								{"name":"南宁"},
								{"name":"柳州"},
								{"name":"防城港"}
							] 
						},
						{ 
							"name":"黑龙江",
							"children":
							[
								{"name":"哈尔滨"},
								{"name":"齐齐哈尔"},
								{"name":"牡丹江"},
								{"name":"大庆"}
							] 
						},
						{ 
							"name":"新疆" , 
							"children":
							[
								{"name":"乌鲁木齐"},
								{"name":"克拉玛依"},
								{"name":"吐鲁番"},
								{"name":"哈密"}
							]
						},
						{ 
							"name":"河北" , 
							"children":
							[
								{"name":"石家庄"},
								{"name":"唐山"},
								{"name":"邯郸"},
								{"name":"秦皇岛"}
							]
						},
						{ 
							"name":"西藏" , 
							"children":
							[
								{"name":"拉萨"},
								{"name":"昌都"},
								{"name":"林芝"}
							]
						},
						{ 
							"name":"江苏" , 
							"children":
							[
								{"name":"南京"},
								{"name":"无锡"},
								{"name":"徐州"},
								{"name":"常州"},
								{"name":"连云港"},
								{"name":"淮安"}
							]
						},
						{ 
							"name":"湖南" , 
							"children":
							[
								{"name":"长沙"},
								{"name":"株洲"},
								{"name":"湘潭"},
								{"name":"衡阳"},
								{"name":"邵阳"},
								{"name":"岳阳"}
							]
						},
						{ 
							"name":"海南" , 
							"children":
							[
								{"name":"海口"},
								{"name":"三亚"},
								{"name":"三沙"}
							]
						},
						{ 
							"name":"陕西" , 
							"children":
							[
								{"name":"西安"},
								{"name":"咸阳"},
								{"name":"汉中"},
								{"name":"安康"},
								{"name":"榆林"},
								{"name":"延安"}
							]
						},
						{ 
							"name":"甘肃" , 
							"children":
							[
								{"name":"兰州"},
								{"name":"酒泉"},
								{"name":"金昌"},
								{"name":"天水"},
								{"name":"嘉峪关"},
								{"name":"武威"}
							]
						}
					]
				},
			margin: { left: 50, top: 20, right: 50, bottom: 20 }
		};
		$scope.treeConfig1 = {
			data: 
				{
					"name":"中国",
					"children":
					[
						{ 
						  "name":"浙江" , 
					  	  "children":
					  	  [
						  	  	{"name":"杭州" },
						  	  	{"name":"宁波" },
						  	  	{"name":"温州" },
						  	  	{"name":"绍兴" }
					  	  ] 
					  	},
					  	
						{ 
							"name":"广西" , 
							"children":
							[
								{
								"name":"桂林",
								"children":
								[
									{"name":"秀峰区"},
									{"name":"叠彩区"},
									{"name":"象山区"},
									{"name":"七星区"}
								]
								},
								{"name":"南宁"},
								{"name":"柳州"},
								{"name":"防城港"}
							] 
						},
						
						{ 
							"name":"黑龙江",
							"children":
							[
								{"name":"哈尔滨"},
								{"name":"齐齐哈尔"},
								{"name":"牡丹江"},
								{"name":"大庆"}
							] 
						},
						
						{ 
							"name":"新疆" , 
							"children":
							[
								{"name":"乌鲁木齐"},
								{"name":"克拉玛依"},
								{"name":"吐鲁番"},
								{"name":"哈密"}
							]
						}
					]
				}
		};
		$scope.treeConfig2 = {
			data: 
				{
					"name":"机器学习",
					"children":
					[
						{ 
						  "name":"监督学习" , 
					  	  "children":
					  	  [
						  	  	{"name":"推荐",
						  	  	"children":
								[
									{"name":"基于用户"},
									{"name":"基于物品"},
									{"name":"基于内容"},
									{"name":"基于模型"}
								]
								},
						  	  	{"name":"回归",
						  	  	"children":
								[
									{"name":"线性回归"},
									{"name":"岭回归"}
								]
								},
						  	  	{"name":"分类",
						  	  	"children":
								[
									{"name":"K近邻"},
									{"name":"决策树"},
									{"name":"支持向量机"},
									{"name":"逻辑回归"}
								]
								}
					  	  	] 
					  	},
					  	
						{ 
							"name":"无监督学习" , 
							"children":
							[
								{
								"name":"聚类",
								"children":
								[
									{"name":"最大期望"},
									{"name":"K均值"}
								]
								},
								{"name":"关联分析",
								"children":
								[
									{"name":"Apriori"},
									{"name":"FP-growth"}
								]
								},
								{"name":"深度学习",
								"children":
								[
									{"name":"深度神经网络"},
									{"name":"深度信念网络"},
									{"name":"卷积神经网络"}
								]
								}
							] 
						},
						
						{ 
							"name":"增强学习",
							"children":
							[
								{"name":"马尔科夫决策链"}
							] 
						}
					]
				}
		};
		$scope.forceConfig1 = {
			nodes : [ { name: "桂林" }, { name: "广州" }, { name: "厦门" }, { name: "杭州" },
					{ name: "上海" }, { name: "青岛" }, { name: "天津" }, { name: "南京"} ],
			edges : [ { source : 0, target: 1 }, { source : 0, target: 2 }, { source : 7, target: 3 }, 
					{ source : 1, target: 4 }, { source : 1, target: 5 }, { source : 1, target: 6 } ],
			radius : 15
		};
		$scope.forceConfig2 = {
			nodes : [ { name: "Citrix" }, { name: "Cisco" }, { name: "Apple" }, { name: "Dell" },
					  	{ name: "Microsoft" }, { name: "Google" }, { name: "Facebook" } ],
			edges : [ { source : 0, target: 1 }, { source : 0, target: 2 }, { source : 0, target: 3 }, 
					{ source : 1, target: 4 }, { source : 1, target: 5 }, { source : 1, target: 6 } ],
			distance : 200,
			force: 100
		}
    }
]).controller('DetailController', [
	'$modal',
	'$scope',
    function ($modal, $scope) {
	    $scope.packConfig1 = {
			data: 
				{
					"name":"Asphalt",
					"children":
					[
						{ 
						  "name":"A" , 
					  	  "children":
					  	  [
						  	  	{"name":"After" },
						  	  	{"name":"About" },
						  	  	{"name":"Abort" },
						  	  	{"name":"Afraid" }
					  	  ] 
					  	},
						{ 
							"name":"B" , 
							"children":
							[
								{"name":"Blue"},
								{"name":"Bring"},
								{"name":"Beside"},
								{"name":"Bottom"},
								{"name":"Be"},
								{"name":"Bing"}
							]
						},
						{ 
							"name":"C" , 
							"children":
							[
								{"name":"Chart"},
								{"name":"Citrix"},
								{"name":"Copy"},
								{"name":"Config"},
								{"name":"Con"},
								{"name":"Clone"},
								{"name":"Cride"}
							]
						},
						{ 
							"name":"D" , 
							"children":
							[
								{"name":"Define"},
								{"name":"Degree"},
								{"name":"Decide"},
								{"name":"Dior"},
								{"name":"Did"},
								{"name":"Do"}
							]
						},
						{ 
							"name":"E" , 
							"children":
							[
								{"name":"Energy"},
								{"name":"En"},
								{"name":"Enough"},
								{"name":"Eroll"}
							]
						},
						{ 
							"name":"F" , 
							"children":
							[
								{"name":"Flag"},
								{"name":"Fly"},
								{"name":"Flow"},
								{"name":"Feel"},
								{"name":"For"},
								{"name":"Fing"}
							]
						},
						{ 
							"name":"G" , 
							"children":
							[
								{"name":"Green"},
								{"name":"Glue"},
								{"name":"Gary"},
								{"name":"Goal"},
								{"name":"Go"}
							]
						}
					]
				},
			radius: 23,
			margin: { left: 50, top: 20, right: 50, bottom: 20 }
		};
	    $scope.packConfig2 = {
			data: 
				{
					"name":"中国",
					"children":
					[
						{ 
						  "name":"浙江" , 
					  	  "children":
					  	  [
						  	  	{"name":"杭州" },
						  	  	{"name":"宁波" },
						  	  	{"name":"温州" },
						  	  	{"name":"绍兴" }
					  	  ] 
					  	},
						{ 
							"name":"广西" , 
							"children":
							[
								{"name":"桂林"},
								{"name":"南宁"},
								{"name":"柳州"},
								{"name":"防城港"}
							] 
						},
						{ 
							"name":"黑龙江",
							"children":
							[
								{"name":"哈尔滨"},
								{"name":"齐齐哈尔"},
								{"name":"牡丹江"},
								{"name":"大庆"}
							] 
						},
						{ 
							"name":"新疆" , 
							"children":
							[
								{"name":"乌鲁木齐"},
								{"name":"克拉玛依"},
								{"name":"吐鲁番"},
								{"name":"哈密"}
							]
						},
						{ 
							"name":"河北" , 
							"children":
							[
								{"name":"石家庄"},
								{"name":"唐山"},
								{"name":"邯郸"},
								{"name":"秦皇岛"}
							]
						},
						{ 
							"name":"西藏" , 
							"children":
							[
								{"name":"拉萨"},
								{"name":"昌都"},
								{"name":"林芝"}
							]
						},
						{ 
							"name":"江苏" , 
							"children":
							[
								{"name":"南京"},
								{"name":"无锡"},
								{"name":"徐州"},
								{"name":"常州"},
								{"name":"连云港"},
								{"name":"淮安"}
							]
						},
						{ 
							"name":"湖南" , 
							"children":
							[
								{"name":"长沙"},
								{"name":"株洲"},
								{"name":"湘潭"},
								{"name":"衡阳"},
								{"name":"邵阳"},
								{"name":"岳阳"}
							]
						},
						{ 
							"name":"海南" , 
							"children":
							[
								{"name":"海口"},
								{"name":"三亚"},
								{"name":"三沙"}
							]
						},
						{ 
							"name":"陕西" , 
							"children":
							[
								{"name":"西安"},
								{"name":"咸阳"},
								{"name":"汉中"},
								{"name":"安康"},
								{"name":"榆林"},
								{"name":"延安"}
							]
						},
						{ 
							"name":"甘肃" , 
							"children":
							[
								{"name":"兰州"},
								{"name":"酒泉"},
								{"name":"金昌"},
								{"name":"天水"},
								{"name":"嘉峪关"},
								{"name":"武威"}
							]
						}
					]
				},
			margin: { left: 50, top: 20, right: 50, bottom: 20 }
		};
		$scope.treeConfig1 = {
			data: 
				{
					"name":"中国",
					"children":
					[
						{ 
						  "name":"浙江" , 
					  	  "children":
					  	  [
						  	  	{"name":"杭州" },
						  	  	{"name":"宁波" },
						  	  	{"name":"温州" },
						  	  	{"name":"绍兴" }
					  	  ] 
					  	},
					  	
						{ 
							"name":"广西" , 
							"children":
							[
								{
								"name":"桂林",
								"children":
								[
									{"name":"秀峰区"},
									{"name":"叠彩区"},
									{"name":"象山区"},
									{"name":"七星区"}
								]
								},
								{"name":"南宁"},
								{"name":"柳州"},
								{"name":"防城港"}
							] 
						},
						
						{ 
							"name":"黑龙江",
							"children":
							[
								{"name":"哈尔滨"},
								{"name":"齐齐哈尔"},
								{"name":"牡丹江"},
								{"name":"大庆"}
							] 
						},
						
						{ 
							"name":"新疆" , 
							"children":
							[
								{"name":"乌鲁木齐"},
								{"name":"克拉玛依"},
								{"name":"吐鲁番"},
								{"name":"哈密"}
							]
						}
					]
				}
		};
		$scope.treeConfig2 = {
			data: 
				{
					"name":"机器学习",
					"children":
					[
						{ 
						  "name":"监督学习" , 
					  	  "children":
					  	  [
						  	  	{"name":"推荐",
						  	  	"children":
								[
									{"name":"基于用户"},
									{"name":"基于物品"},
									{"name":"基于内容"},
									{"name":"基于模型"}
								]
								},
						  	  	{"name":"回归",
						  	  	"children":
								[
									{"name":"线性回归"},
									{"name":"岭回归"}
								]
								},
						  	  	{"name":"分类",
						  	  	"children":
								[
									{"name":"K近邻"},
									{"name":"决策树"},
									{"name":"支持向量机"},
									{"name":"逻辑回归"}
								]
								}
					  	  	] 
					  	},
					  	
						{ 
							"name":"无监督学习" , 
							"children":
							[
								{
								"name":"聚类",
								"children":
								[
									{"name":"最大期望"},
									{"name":"K均值"}
								]
								},
								{"name":"关联分析",
								"children":
								[
									{"name":"Apriori"},
									{"name":"FP-growth"}
								]
								},
								{"name":"深度学习",
								"children":
								[
									{"name":"深度神经网络"},
									{"name":"深度信念网络"},
									{"name":"卷积神经网络"}
								]
								}
							] 
						},
						
						{ 
							"name":"增强学习",
							"children":
							[
								{"name":"马尔科夫决策链"}
							] 
						}
					]
				}
		};
		$scope.forceConfig1 = {
			nodes : [ { name: "桂林" }, { name: "广州" }, { name: "厦门" }, { name: "杭州" },
					{ name: "上海" }, { name: "青岛" }, { name: "天津" }, { name: "南京"} ],
			edges : [ { source : 0, target: 1 }, { source : 0, target: 2 }, { source : 7, target: 3 }, 
					{ source : 1, target: 4 }, { source : 1, target: 5 }, { source : 1, target: 6 } ],
			radius : 15
		};
		$scope.forceConfig2 = {
			nodes : [ { name: "Citrix" }, { name: "Cisco" }, { name: "Apple" }, { name: "Dell" },
					  	{ name: "Microsoft" }, { name: "Google" }, { name: "Facebook" } ],
			edges : [ { source : 0, target: 1 }, { source : 0, target: 2 }, { source : 0, target: 3 }, 
					{ source : 1, target: 4 }, { source : 1, target: 5 }, { source : 1, target: 6 } ],
			distance : 200,
			force: 100
		}
    }
]);