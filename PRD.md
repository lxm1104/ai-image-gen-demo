我希望制作一个网页的 demo，这个 demo 中，界面是基础的对话形式，用户通过对话的方式与语言模型进行交互。
用户在输入框中可以输入生成图片的 prompt 文字，也可以输入上传一张图片作为参考图。
输入框右侧有“生成”按钮，点击后，语言模型将根据当前用户输入的内容，调用不同的生成图片模型作为工具，自动调用不同的生成图片模型，满足用户的需求。
在图片生成之后，在对话界面中展现生成的图片。
请帮我设计一个模型间相互调用的流程/架构，并且实现以上功能的 demo。
参考文档：
1. 语言模型 API 调用方式 https://modelscope.cn/docs/model-service/API-Inference/intro
2. 生图模型的 API 文档 https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d，使用其中的 “LiblibAI自定义模型”。
3. 需要支持以下生图 LiblibAI自定义模型作为工具，供语言模型进行调用：
    a. 将白天转为夜景 https://www.liblib.art/apis/workflow?uuid=1badca36971c412db7973421f6425a8f&modelInfoPath=3b038c7d7b93470a9844e96c7ba8568d&from=feed
    b. 通用的文生图模型使用 https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d文档中的 3.1.1 星流Star-3 Alpha文生图