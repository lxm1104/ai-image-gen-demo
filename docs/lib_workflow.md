接口请求：
POSThttps://openapi.liblibai.cloud/api/generate/comfyui/app
参数示例
JSON
复制
request_body ={
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "11": {
            "class_type": "ACN_AdvancedControlNetApply",
            "inputs": {
                "strength": 0.9
            }
        },
        "19": {
            "class_type": "ImageResize+",
            "inputs": {
                "height": 2048
            }
        },
        "22": {
            "class_type": "LoadImage",
            "inputs": {
                "image": "https://liblibai-tmp-image.liblib.cloud/img/690f193c97724d0aa4909463c2813873/91cf165d6a46c96c3567d59b97f020471b5c9ca4c80be9ff6d637d84597d955c.png"
            }
        },
        "34": {
            "class_type": "easy stylesSelector",
            "inputs": {
                "styles": "fooocus_styles"
            }
        },
        "workflowUuid": "1badca36971c412db7973421f6425a8f"
    }
}
参数说明
节点ID	节点类型	节点名称	参数项	参数名称	参数说明
22	LoadImage	上传图片	
image
图像
{
  "name": "image",
  "displayName": "图像",
  "type": "IMAGE",
  "defaultValue": "img/690f193c97724d0aa4909463c2813873/91cf165d6a46c96c3567d59b97f020471b5c9ca4c80be9ff6d637d84597d955c.png",
  "image_upload": true,
  "id": "image",
  "isMaskImage": false,
  "parentId": 22
}
19	ImageResize+	图像尺寸	
height
高度
{
  "name": "height",
  "displayName": "高度",
  "type": "INT",
  "defaultValue": 2048,
  "min": 0,
  "max": 8192,
  "step": 1,
  "id": "height",
  "parentId": 19
}
11	ACN_AdvancedControlNetApply	与原图吻合度	
strength
强度
{
  "name": "strength",
  "displayName": "强度",
  "type": "FLOAT",
  "defaultValue": 0.9,
  "min": 0,
  "max": 10,
  "step": 0.01,
  "id": "strength",
  "parentId": 11
}
34	easy stylesSelector	风格提示词选择器	
styles
风格类型
{
  "name": "styles",
  "displayName": "风格类型",
  "type": "LIST",
  "enumList": [
    "fooocus_styles"
  ],
  "defaultValue": "fooocus_styles",
  "id": "styles",
  "parentId": 34
}
查询生图结果
POSThttps://openapi.liblibai.cloud/api/generate/comfy/status
查询结果示意
JSON
复制
{
        "code": 0,
        "data": {
                "accountBalance": 199950372,
                "generateStatus": 5,
                "generateUuid": "74f7298eafa74d40add124c47f6b87f0",
                "images": [
                        {
                                "auditStatus": 3,
                                "imageUrl": "https://liblibai-tmp-image.liblib.cloud/img/360643a3d8414af8b99664b208bc9302/0f7d9314b811c9e2c9cc6380b3e2ac8109d80665f438892a7edac899eb574efc.png",
                                "nodeId": "28",
                                "outputName": "SaveImage"
                        }
                ],
                "percentCompleted": 1,
                "pointsCost": 10,
                "videos": []
        },
        "msg": ""
}}
返回值说明
参数	类型	备注
generateUuid	string	生图任务uuid，使用该uuid查询生图进度
generateStatus	int	
生图任务的执行状态：
1：等待执行
2：执行中
3：已生图
4：审核中
5：任务成功
6：任务失败
percentCompleted	float	生图进度，0到1之间的浮点数
generateMsg	string	生图信息，提供附加信息，如生图失败信息
images	[]object	图片列表，只提供审核通过的图片
images.0.imageUrl	string	图片地址，可直接访问，地址有时效性：7天
images.0.auditStatus	int	
审核状态：
1：待审核
2：审核中
3：审核通过
4：审核拦截
5：审核失败
videos	[]object	图片列表，只提供审核通过的图片
videos.0.videoUrl	string	视频列表，只提供审核通过的视频
videos.0.coverPath	string	视频地址，可直接访问，地址有时效性：7天
videos.0.nodeId	string	输出视频的节点ID（可忽略）
videos.0.outputName	string	输出视频的节点名称
videos.0.auditStatus	int	
审核状态：
1：待审核
2：审核中
3：审核通过
4：审核拦截
5：审核失败