> LiblibAI-API产品主页和购买下单：https://www.liblib.art/apis

## 产品简介

欢迎使用LiblibAI x 星流 图像大模型API来进行创作！无论你是进行个人项目还是为其他终端用户提供的服务，我们的API都能满足你的需求。

**全新AI图像模型和工作流API**，提供极致的图像质量，在**输出速度、生图成本和图像卓越性**之间实现平衡。

您有任何问题，可随时联系商务：17521599324，电话微信同。

> 我们提供了工作流产品和2款API模型产品：
>
> * LiblibAI工作流：社区商用工作流和个人本地工作流均可支持调用。工作流挑选和商用查询可至https://www.liblib.art/workflows
>
> * 星流Star-3 Alpha：适合对AI生图参数不太了解或不想复杂控制的用户。搭载自带LoRA推荐算法，对自然语言的精准响应，提供极致的图像质量，能够生成具有照片级真实感的视觉效果，不能自由添加LoRA，仅支持部分ControlNet。生图效果可至星流官网https://xingliu.art/体验。
>
> * LiblibAI自定义模型：若需要特定LoRA和ControlNet只能选此模式，适合高度自由、精准控制和特定风格的场景，基于F.1/XL/v3/v1.5等基础算法，支持自定义调用LiblibAI内全量20万+可商用模型和任意私有模型。最新开源模型和插件第一时间更新。模型挑选和商用查询可至本文档3.1或https://www.liblib.art/。
>
> *API试用计划：登录后可领取500试用积分，限时7天免费测试体验。*

**如何选择适合您的API模型产品——**

![](images/image-14.png)

## 文档版本更新

| **日期**     | **说明**                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| 2024.11.15 | 支持F.1风格迁移：参考《[F.1风格迁移参数示例](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-FTAcdzv1eoTvXNxIRhmcDo4ynBg)》 |
| 2024.12.5  |                                                                                                                            |
| 2024.12.18 | 查询生图结果的返回字段，新增pointsCost（当次任务消耗积分）和accountBalance（账户剩余积分数）                                                                 |
| 2025.1.2   | [2.4 增加Comfyui接入星流API](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-WzHWdTKeaoCKmDxt1CicGe3Vnze)      |
| 2025.1.17  | [5 增加调用ComfyUI工作流](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-Ip5Td5eL4oEkEuxt0Dvcw8gDnrg)          |
| 2025.2.5   | [8 增加java的SDK](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-GlGUdjiaXowiNNxrv6zcvn54nGf)              |
| 2025.3.18  | 增加F.1-ControlNet（PuLID人像换脸、主体参考）                                                                                           |
| 2025.3.24  | [8 增加js的SDK](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-GlGUdjiaXowiNNxrv6zcvn54nGf)                |
| 2025.04.30 | 支持图片上传：[ LiblibAI-API文件上传](https://liblibai.feishu.cn/wiki/A9M2whHxsiKtu8kpIn3cZp0PnVw)                                    |

## 1. 能力地图

* [API KEY的使用](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-R4J6d3oQUoXxjRxTGrhcNm4Ineo)

* [星流Star-3生图](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-R8XcdGy3UoggcjxH8x5cZJB2n9c)

* [自定义模型生图](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-VDZjdAgYEoJzR2xIvQScSQCUnIc)

* [图片上传，获取oss地址](https://liblibai.feishu.cn/wiki/A9M2whHxsiKtu8kpIn3cZp0PnVw)

## 2. 开始使用

在这一部分，我们将展示如何开通API的权益，以及如何创建你的API密钥。

### 2.1 访问地址

Liblib开放平台域名：https://openapi.liblibai.cloud（无法直接打开，需配合密钥访问）

### 2.2 计费规则

非固定消耗，每次生图任务消耗的积分与以下参数有关：

* 选用模型

* 采样步数（steps）

* 采样方法（sampler，SDE系列会产生额外消耗）

* 生成图片宽度

* 生成图片高度

* 生成图片张数

* 重绘幅度（denoisingStrength）

* 高分辨率修复的重绘步数和重绘幅度

* Controlnet数量

### 2.3 并发数和QPS

* 生图任务并发数默认5（同时可进行的生图任务数）

* 发起生图任务接口QPS限制，默认1秒1次

* 查询生图结果接口QPS无限制

### 2.4 生成API密钥

在登录Liblib领取API试用积分或购买API积分后，Liblib会生成开放平台访问密钥，用于后续API接口访问，密钥包括：

* `AccessKey`，API访问凭证，唯一识别访问用户，长度通常在20-30位左右，如：KIQMFXjHaobx7wqo9XvYKA

* `SecretKey`，API访问密钥，用于加密请求参数，避免请求参数被篡改，长度通常在30位以上，如：KppKsn7ezZxhi6lIDjbo7YyVYzanSu2d

#### 2.4.1 使用密钥

申请API密钥之后，需要在每次请求API接口的查询字符串中固定传递以下参数：

| 参数             | 类型     | 是否必需 | 说明                        |
| -------------- | ------ | ---- | ------------------------- |
| AccessKey      | String | 是    | 开通开放平台授权的访问**AccessKey**  |
| Signature      | String | 是    | 加密请求参数生成的签名，签名公式见下节“生成签名” |
| Timestamp      | String | 是    | 生成签名时的毫秒时间戳，整数字符串，有效期5分钟  |
| SignatureNonce | String | 是    | 生成签名时的随机字符串               |

如请求地址：`https://test.xxx.com/api/genImg?AccessKey=KIQMFXjHaobx7wqo9XvYKA&Signature=test1232132&Timestamp=1725458584000&SignatureNonce=random1232`

#### 2.4.2 生成签名

签名生成公式如下：

```bash
# 1. 用"&"拼接参数
# URI地址：以上方请求地址为例，为“/api/genImg”
# 毫秒时间戳：即上节“使用密钥”中要传递的“Timestamp”
# 随机字符串：即上节“使用密钥”中要传递的“SignatureNonce”
原文 = URI地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
# 2. 用SecretKey加密原文，使用hmacsha1算法
密文 = hmacSha1(原文, SecretKey)
# 3. 生成url安全的base64签名
# 注：base64编码时不要补全位数
签名 = encodeBase64URLSafeString(密文)
```

##### **Java生成签名示例，以访问上方“使用密钥”的请求地址为例：**

```java
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.RandomStringUtils;

public class SignUtil {

    /**
     * 生成请求签名
     * 其中相关变量均为示例，请替换为您的实际数据
     */
    public static String makeSign() {

        // API访问密钥
        String secretKey = "KppKsn7ezZxhi6lIDjbo7YyVYzanSu2d";
        
        // 请求API接口的uri地址
        String uri = "/api/generate/webui/text2img";
        // 当前毫秒时间戳
        Long timestamp = System.currentTimeMillis();
        // 随机字符串
        String signatureNonce = RandomStringUtils.randomAlphanumeric(10);
        // 拼接请求数据
        String content = uri + "&" + timestamp + "&" + signatureNonce;
    
        try {
            // 生成签名
            SecretKeySpec secret = new SecretKeySpec(secretKey.getBytes(), "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(secret);
            return Base64.encodeBase64URLSafeString(mac.doFinal(content.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("no such algorithm");
        } catch (InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }
}
```

##### **Python生成签名示例，以访问上方“使用密钥”的请求地址为例：**

```python
import hmac
from hashlib import sha1
import base64
import time
import uuid

def make_sign():
    """
    生成签名
    """

    # API访问密钥
    secret_key = 'KppKsn7ezZxhi6lIDjbo7YyVYzanSu2d'

    # 请求API接口的uri地址
    uri = "/api/genImg"
    # 当前毫秒时间戳
    timestamp = str(int(time.time() * 1000))
    # 随机字符串
    signature_nonce= str(uuid.uuid4())
    # 拼接请求数据
    content = '&'.join((uri, timestamp, signature_nonce))
    
    # 生成签名
    digest = hmac.new(secret_key.encode(), content.encode(), sha1).digest()
    # 移除为了补全base64位数而填充的尾部等号
    sign = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()
    return sign

```

##### **NodeJs 生成签名示例，以访问上方“使用密钥”的请求地址为例：**

```javascript
const hmacsha1 = require("hmacsha1");
const randomString = require("string-random");
// 生成签名
const urlSignature = (url) => {
  if (!url) return;
  const timestamp = Date.now(); // 当前时间戳
  const signatureNonce = randomString(16); // 随机字符串，你可以任意设置，这个没有要求
  // 原文 = URl地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
  const str = `${url}&${timestamp}&${signatureNonce}`;
  const secretKey = "官网上的 SecretKey "; // 下单后在官网中，找到自己的 SecretKey'
  const hash = hmacsha1(secretKey, str);
  // 最后一步： encodeBase64URLSafeString(密文)
  // 这一步很重要，生成安全字符串。java、Python 以外的语言，可以参考这个 JS 的处理
  let signature = hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return {
    signature,
    timestamp,
    signatureNonce,
  };
};
// 例子：原本查询生图进度接口是 https://openapi.liblibai.cloud/api/generate/webui/status
// 加密后，url 就变更为 https://openapi.liblibai.cloud/api/generate/webui/status?AccessKey={YOUR_ACCESS_KEY}&Signature={签名}&Timestamp={时间戳}&SignatureNonce={随机字符串}
const getUrl = () => {
  const url = "/api/generate/webui/status";
  const { signature, timestamp, signatureNonce } = urlSignature(url);
  const accessKey = "替换自己的 AccessKey"; // '下单后在官网中，找到自己的 AccessKey'
  return `${url}?AccessKey=${accessKey}&Signature=${signature}&Timestamp=${timestamp}&SignatureNonce=${signatureNonce}`;
};
```



## 3. 星流Star-3 Alpha&#x20;

### 3.1 星流Star-3 Alpha生图

#### 3.1.1 星流Star-3 Alpha文生图

* 接口：POST /api/generate/webui/text2img/ultra

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数             | 类型     | 是否必需 | 说明          | 备注                    |
  | -------------- | ------ | ---- | ----------- | --------------------- |
  | templateUuid   | string | 是    |             |                       |
  | generateParams | object | 是    | 生图参数，json结构 | 参数中的图片字段需提供可访问的完整图片地址 |

* 返回值：

  | 参数           | 类型     | 备注                     |
  | ------------ | ------ | ---------------------- |
  | generateUuid | string | 生图任务uuid，使用该uuid查询生图进度 |

* 参数说明

| **变量名**     | **格式** | **备注**                     | **数值范围** | **必填** | **示例** |
| ----------- | ------ | -------------------------- | -------- | ------ | ------ |
| prompt      | string | 正向提示词，文本                   |          | 是      |        |
| aspectRatio | string | 图片宽高比预设，与imageSize二选一配置即可  |          | 二选一配置  |        |
| imageSize   | Object | 图片具体宽高，与aspectRatio二选一配置即可 |          |        |        |
| imgCount    | int    | 单次生图张数                     | 1 \~ 4   | 是      |        |
| controlnet  | Object | 构图控制                       |          | 否      |        |

#### 3.1.2 星流Star-3 Alpha图生图

* 接口：POST /api/generate/webui/img2img/ultra

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数             | 类型     | 是否必需 | 说明          | 备注                    |
  | -------------- | ------ | ---- | ----------- | --------------------- |
  | templateUUID   | string | 是    |             |                       |
  | generateParams | object | 是    | 生图参数，json结构 | 参数中的图片字段需提供可访问的完整图片地址 |

* 返回值：

  | 参数           | 类型     | 备注                     |
  | ------------ | ------ | ---------------------- |
  | generateUuid | string | 生图任务uuid，使用该uuid查询生图进度 |

* 参数说明

| **变量名**     | **格式** | **备注**   | **数值范围**       | **必填** | **示例** |
| ----------- | ------ | -------- | -------------- | ------ | ------ |
| prompt      | string | 正向提示词，文本 |                | 是      |        |
| sourceImage | string | 参考图URL   | 参考图可公网访问的完整URL | 是      |        |
| imgCount    | int    | 单次生图张数   | 1 \~ 4         | 是      |        |
| controlnet  | Object | 构图控制     |                | 否      |        |

###

### 3.2 查询生图结果

* 接口：POST /api/generate/webui/status

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数           | 类型     | 是否必需 | 备注                    |
  | ------------ | ------ | ---- | --------------------- |
  | generateUuid | string | 是    | 生图任务uuid，发起生图任务时返回该字段 |

* 返回值：

  | 参数                   | 类型        | 备注                                                                                                       |
  | -------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
  | generateUuid         | string    | 生图任务uuid，使用该uuid查询生图进度                                                                                   |
  | generateStatus       | int       | [生图状态见下方3.3.1节](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#EsC3dFI20ohviexvZUNcveyFnIb) |
  | percentCompleted     | float     | 生图进度，0到1之间的浮点数，（暂未实现）                                                                                    |
  | generateMsg          | string    | 生图信息，提供附加信息，如生图失败信息                                                                                      |
  | pointsCost           | int       | 本次生图任务消耗积分数                                                                                              |
  | accountBalance       | int       | 账户剩余积分数                                                                                                  |
  | images               | \[]object | 图片列表，只提供审核通过的图片                                                                                          |
  | images.0.imageUrl    | string    | 图片地址，可直接访问，地址有时效性：7天                                                                                     |
  | images.0.seed        | int       | 随机种子值                                                                                                    |
  | iamges.0.auditStatus | int       | [审核状态见下方2.5.2节](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#AJCydelpaoSvNSx3k8rcGtUnnRf) |

  示例：

  ```json
  {
      "code": 0,
      "msg": "",
      "data": {
          "generateUuid": "8dcbfa2997444899b71357ccb7db378b",
          "generateStatus": 5,
          "percentCompleted": 0,
          "generateMsg": "",
          "pointsCost": 10,// 本次任务消耗积分数
          "accountBalance": 1356402,// 账户剩余积分数
          "images": [
              {
                  "imageUrl": "https://liblibai-online.liblib.cloud/sd-images/08efe30c1cacc4bb08df8585368db1f9c082b6904dd8150e6e0de5bc526419ee.png",
                  "seed": 12345,
                  "auditStatus": 3
              }
          ]
      }
  }
  ```

### 3.3 参数模版预设

还提供了一些封装后的参数预设，您可以只提供必要的生图参数，极大简化了配置成本，欢迎体验\~

#### 3.3.1 模版选择（templateUuid）

| 模板名称              | **模板UUID**                       | **备注** |
| ----------------- | -------------------------------- | ------ |
| 星流Star-3 Alpha文生图 | 5d7e67009b344550bc1aa6ccbfa1d7f4 |        |
| 星流Star-3 Alpha图生图 | 07e00af4fc464c7ab55ff906f8acf1b7 |        |

#### 3.3.2 模版传参示例

以下提供了调用各类模版时的传参示例，方便您理解不同模版的使用方式。

注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。

##### 星流Star-3 Alpha文生图 - 简易版本

##### 星流Star-3 Alpha图生图 - 简易版本

##### F.1 - 主体参考参数示例

* 接口：POST /api/generate/webui/text2img/ultra

```json
 {
        "templateUuid":"5d7e67009b344550bc1aa6ccbfa1d7f4",
        "generateParams":{
            "prompt": "A fluffy cat lounges on a plush cushion.",
            "promptMagic": 1,
            "aspectRatio":"square",
            "imgCount":1 ,

            "controlnet":{
                "controlType":"subject",
                "controlImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/3c65a38d7df2589c4bf834740385192128cf035c7c779ae2bbbc354bf0efcfcb.png",
            }        
        }
    }
```



### 3.4 ComfyUI接入星流API

* 准备Comfyui环境，到https://github.com/comfyanonymous/ComfyUI下载免安装文件，解压，有显卡点击run\_nvidia\_gpu.bat启动Comfyui，没有显卡点击run\_cpu.bat启动，启动后保留运行后台不关闭，在web进行配置操作。

* 下载星流节点文件https://github.com/lib-teamwork/ComfyUI-liblib，放到./ComfyUl/custom\_nodes文件夹下。

* 重启Comfyui打开workflow文件夹，图片生成工作流文件

* 鉴权信息需要API密钥，appkey对应Accesskey，appsecret对应Secretkey

![](images/image-13.png)

* 建议自己再安装一个comfyui manager维护各种新节点: https://github.com/ltdrdata/ComfyUI-Manager





## 4. LiblibAI自定义模型

* 可自由调用LiblibAI网站内F.1-dev/XL/v3/v1.5全量模型（暂不支持混元和PixArt），适合高度自由和精准控制的场景。

* 调用条件

  * 同账号下的个人主页内所有模型，本地模型可先在LiblibAI官网右上角“发布”上传个人模型，可按需设置“仅个人可见”，即可仅被本账号在API调用，不会被公开查看或调用。

  * LiblibAI官网内，模型详情页右侧，作者授权“可出售生成图片或用于商业目的”的所有模型。



### 4.1  接口文档

#### 4.1.1 查询模型版本

在LiblibAI网站上挑选作者授权可商用的模型，个人私有模型上传时选择“自见”的模型也可被个人api账号调用，获取模型链接结尾的version\_uuid，调接口进行查询。

#### 4.1.2  查询模型版本参数示例&#x20;

* 接口：POST /api/model/version/get

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数          | 类型     | 是否必需 | 说明           | 备注                                              |
  | ----------- | ------ | ---- | ------------ | ----------------------------------------------- |
  | versionUuid | string | 是    | 要查询的模型版本uuid | ![](images/image-12.png)![](images/image-8.png) |

##### 4.1.2.1 返回值示例

```json
{
    "version_uuid": "21df5d84cca74f7a885ba672b5a80d19",//LiblibAI官网模型链接后缀
    "model_name": "AWPortrait XL"
    "version_name": "1.1"
    "baseAlgo": "基础算法 XL"，
    "show_type": "1"，//公开可用的模型
    "commercial_use": "1"，//可商用为1，不可商用为0
    "model_url": "https://www.liblib.art/modelinfo/f8b990b20cb943e3aa0e96f34099d794?versionUuid=21df5d84cca74f7a885ba672b5a80d19"
    }
}
```

##### 4.1.2.2 异常情况：

未匹配到：提示“未找到与{version\_uuid}对应的模型，请检查version\_uuid是否正确，或所选模型是否为Checkpoint或LoRA”；

baseAlgo不在给定范围内的，提示“{version\_uuid}不在API目前支持的baseAlgo范围内”。



#### 4.1.3 提交文生图任务

* 接口：POST /api/generate/webui/text2img

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数             | 类型     | 是否必需 | 说明                                                                                                  | 备注                    |
  | -------------- | ------ | ---- | --------------------------------------------------------------------------------------------------- | --------------------- |
  | templateUuid   | string | 否    | [参数模板uuid](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#E4JXdJAn0ob6v0xRnBrcTRoynzg) |                       |
  | generateParams | object | 是    | 生图参数，json结构                                                                                         | 参数中的图片字段需提供可访问的完整图片地址 |

* 返回值：

  | 参数           | 类型     | 备注                     |
  | ------------ | ------ | ---------------------- |
  | generateUuid | string | 生图任务uuid，使用该uuid查询生图进度 |

  ##### 4.1.3.1 文生图参数示例

  注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。

  ```json
  {
      "templateUuid": "e10adc3949ba59abbe56e057f20f883e",
      "generateParams": {
          "checkPointId": "0ea388c7eb854be3ba3c6f65aac6bfd3", // 底模 modelVersionUUID
          "prompt": "Asian portrait,A young woman wearing a green baseball cap,covering one eye with her hand", // 选填
          "negativePrompt": "ng_deepnegative_v1_75t,(badhandv4:1.2),EasyNegative,(worst quality:2),", //选填
          "sampler": 15, // 采样方法
          "steps": 20, // 采样步数
          "cfgScale": 7, // 提示词引导系数
          "width": 768, // 宽
          "height": 1024, // 高
          "imgCount": 1, // 图片数量    
          "randnSource": 0,  // 随机种子生成器 0 cpu，1 Gpu
          "seed": 2228967414, // 随机种子值，-1表示随机    
          "restoreFaces": 0,  // 面部修复，0关闭，1开启
          
          // Lora添加，最多5个
          "additionalNetwork": [
              {
                  "modelId": "31360f2f031b4ff6b589412a52713fcf", //LoRA的模型版本versionuuid
                  "weight": 0.3 // LoRA权重
              },
              {
                  "modelId": "365e700254dd40bbb90d5e78c152ec7f", //LoRA的模型版本uuid
                  "weight": 0.6 // LoRA权重
              }
          ],
      
          // 高分辨率修复
          "hiResFixInfo": {
              "hiresSteps": 20, // 高分辨率修复的重绘步数
              "hiresDenoisingStrength": 0.75, // 高分辨率修复的重绘幅度
              "upscaler": 10, // 放大算法模型枚举
              "resizedWidth": 1024,  // 放大后的宽度
              "resizedHeight": 1536  // 放大后的高度
          }
      }
  }
  ```

  ##### 4.1.3.2 返回值示例

  ```json
  {
      "code": 0,
      "msg": "",
      "data": {
          "generateUuid": "8dcbfa2997444899b71357ccb7db378b"
      }
  }
  ```

#### 4.1.4 提交图生图任务

* 接口：POST /api/generate/webui/img2img

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数             | 类型     | 是否必需 | 说明                                                                                                  | 备注                    |
  | -------------- | ------ | ---- | --------------------------------------------------------------------------------------------------- | --------------------- |
  | templateUUID   | string | 否    | [参数模板uuid](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#E4JXdJAn0ob6v0xRnBrcTRoynzg) |                       |
  | generateParams | object | 否    | 生图参数，json结构                                                                                         | 参数中的图片字段需提供可访问的完整图片地址 |

* 返回值：

  | 参数           | 类型     | 备注                     |
  | ------------ | ------ | ---------------------- |
  | generateUuid | string | 生图任务uuid，使用该uuid查询生图进度 |

  ##### 4.1.4.1 图生图参数示例

  注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。

  ```json
  {
      "templateUuid": "9c7d531dc75f476aa833b3d452b8f7ad", // 预设参数模板ID
      "generateParams": {
          // 基础参数
          "checkPointId": "0ea388c7eb854be3ba3c6f65aac6bfd3", //底模
          "prompt": "1 girl wear sunglasses", //正向提示词
          "negativePrompt": //负向提示词
          "clipSkip": 2, // Clip跳过层
          "sampler": 15, //采样方法
          "steps": 20, // 采样步数
          "cfgScale": 7, // 提示词引导系数    
          "randnSource": 0, // 随机种子来源，0表示CPU，1表示GPU
          "seed": -1, // 随机种子值，-1表示随机
          "imgCount": 1, // 1到4
          "restoreFaces": 0,  // 面部修复，0关闭，1开启
          
          // 图像相关参数
          "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
          "resizeMode": 0, // 缩放模式， 0 拉伸，1 裁剪，2 填充 
          "resizedWidth": 1024, // 图像缩放后的宽度
          "resizedHeight": 1536, // 图像缩放后的高度
          "mode": 4, // 0图生图，4局部重绘
          "denoisingStrength": 0.75, // 重绘幅度
          
          // Lora添加，最多5个
          "additionalNetwork": [
              {
                  "modelId": "31360f2f031b4ff6b589412a52713fcf", //LoRA的模型版本uuid
                  "weight": 0.3 // LoRA权重
              },
              {
                  "modelId": "365e700254dd40bbb90d5e78c152ec7f", //LoRA的模型版本uuid
                  "weight": 0.6 // LoRA权重
              }
          ],
          
          // 局部重绘相关参数
          "inpaintParam": { 
              "maskImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/323fc358-618b-4c7d-b431-7d890209e5a5.png", // 蒙版地址
              "maskBlur": 4, // 蒙版模糊度
              "maskPadding": 32, //蒙版边缘预留像素，也称蒙版扩展量 
              "maskMode": 0, // 蒙版模式    
              "inpaintArea": 0, //重绘区域, 0重绘全图，1仅重绘蒙版区域
              "inpaintingFill": 1 //蒙版内容的填充模式
          },
      
          // controlNet，最多4组
          "controlNet": [
              {
                  "unitOrder": 1, // 执行顺序
                  "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/7c1cc38e-522c-43fe-aca9-07d5420d743e.png",
                  "width": 1024, // 参考图宽度
                  "height": 1536, // 参考图高度
                  "preprocessor": 3, // 预处理器枚举值
                  "annotationParameters": { // 预处理器参数， 不同预处理器不同，此处仅为示意
                      "depthLeres": { // 3 预处理器 对应的参数
                          "preprocessorResolution": 1024,
                          "removeNear": 0,
                          "removeBackground": 0
                      }
                  },
                  "model": "6349e9dae8814084bd9c1585d335c24c", // controlnet的模型
                  "controlWeight": 1, // 控制权重
                  "startingControlStep": 0, //开始控制步数
                  "endingControlStep": 1, // 结束控制步数
                  "pixelPerfect": 1, // 完美像素
                  "controlMode": 0, // 控制模式 ，0 均衡，1 更注重提示词，2 更注重controlnet，
                  "resizeMode": 1, // 缩放模式， 0 拉伸，1 裁剪，2 填充
                  "maskImage": "" // 蒙版图
              }
          ]
      }
  }
  ```

  ##### 4.1.4.2 返回值示例

  ```json
  {
      "code": 0,
      "msg": "",
      "data": {
          "generateUuid": "8dcbfa2997444899b71357ccb7db378b"
      }
  }
  ```



#### 4.1.5 查询生图结果

* 接口：POST /api/generate/webui/status

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数           | 类型     | 是否必需 | 备注                    |
  | ------------ | ------ | ---- | --------------------- |
  | generateUuid | string | 是    | 生图任务uuid，发起生图任务时返回该字段 |

* 返回值：

  | 参数                   | 类型        | 备注                                                                                                       |
  | -------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
  | generateUuid         | string    | 生图任务uuid，使用该uuid查询生图进度                                                                                   |
  | generateStatus       | int       | [生图状态见下方3.3.1节](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#EsC3dFI20ohviexvZUNcveyFnIb) |
  | percentCompleted     | float     | 生图进度，0到1之间的浮点数，(暂未实现生图进度)                                                                                |
  | generateMsg          | string    | 生图信息，提供附加信息，如生图失败信息                                                                                      |
  | pointsCost           | int       | 本次生图任务消耗积分数                                                                                              |
  | accountBalance       | int       | 账户剩余积分数                                                                                                  |
  | images               | \[]object | 图片列表，只提供审核通过的图片                                                                                          |
  | images.0.imageUrl    | string    | 图片地址，可直接访问，地址有时效性：7天                                                                                     |
  | images.0.seed        | int       | 随机种子值                                                                                                    |
  | images.0.auditStatus | int       | [审核状态见下方2.5.2节](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#AJCydelpaoSvNSx3k8rcGtUnnRf) |

  示例：

  ```json
  {
      "code": 0,
      "msg": "",
      "data": {
          "generateUuid": "8dcbfa2997444899b71357ccb7db378b",
          "generateStatus": 5,
          "percentCompleted": 0,
          "generateMsg": "",
          "pointsCost": 10,// 本次任务消耗积分数
          "accountBalance": 1356402,// 账户剩余积分数
          "images": [
              {
                  "imageUrl": "https://liblibai-online.liblib.cloud/sd-images/08efe30c1cacc4bb08df8585368db1f9c082b6904dd8150e6e0de5bc526419ee.png",
                  "seed": 12345,
                  "auditStatus": 3
              }
          ]
      }
  }
  ```

### 4.2 参数说明

#### 4.2.1 文生图基础参数

| **变量名**           | **格式**        | **备注**                 | **数值范围**                                                                                                                    | **必填** | **示例** |
| ----------------- | ------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------ | ------ |
| checkPointId      | String        | 模型uuid                 | 从全网可商用模型和自有模型中选择，[详见文档3.1.1](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-MMThdZJGGowxmXxSmU6cc61FnJd) | 是      |        |
| additionalNetwork | list\[object] |                        | [参考additionalNetwork的参数配置](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#MwsSdFSxnoooIgx2g75cX1Cun0f)         | 否      |        |
| vaeId             | String        | VAE的模型uuid             |                                                                                                                             | 否      |        |
| prompt            | string        | 正向提示词，文本               |                                                                                                                             | 是      |        |
| negativePrompt    | string        | 负向提示词，文本               |                                                                                                                             | 是      |        |
| clipSkip          | int           | Clip跳过层                | 1 \~ 12。默认值2                                                                                                                | 是      |        |
| sampler           | int           | 采样器枚举值                 | [从采样方法列表中选择](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-CZ8xdO2lnoIuOzxGo6acDMCmn3e)                 | 是      |        |
| steps             | int           | 采样步数                   | 1 \~ 60                                                                                                                     | 是      |        |
| cfgScale          | double        | cfg\_scale             | 1.0 \~ 15.0                                                                                                                 | 是      |        |
| width             | int           | 初始宽度                   |                                                                                                                             | 是      |        |
| height            | int           | 初始高度                   |                                                                                                                             | 是      |        |
| imgCount          | int           | 单次生图张数                 | 1 \~ 4                                                                                                                      | 是      |        |
| randnSource       | int           | 随机种子生成来源               | 0: CPU，1: GPU。默认值0                                                                                                          | 是      |        |
| seed              | Long          | 随机种子                   |                                                                                                                             | 是      |        |
| restoreFaces      | int           | 面部修复                   | 0：关闭，1：开启。默认值0                                                                                                              | 是      |        |
| hiResFixInfo      | Object        | 高分辨率修复                 | [参考高分辨率修复的相关参数](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#G47rdcgeuol2Jyxl1wyczSBtnYe)                    | 否      |        |
| controlNet        | list\[Object] | 模型加载的ControlNet组合及各自参数 | [参考controlnet参数配置](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#Q9ordwmTRoa7APxVlaDcDLYnnja)                 | 否      |        |

#### 4.2.2 additionalNetwork

| **变量名** | **格式** | **备注**      | **数值范围**                                                                                                                    | **必填** | **示例** |
| ------- | ------ | ----------- | --------------------------------------------------------------------------------------------------------------------------- | ------ | ------ |
| modelId | String | LoRA的模型uuid | 从全网可商用模型和自有模型中选择，[详见文档3.1.1](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-MMThdZJGGowxmXxSmU6cc61FnJd) | 否      |        |
| weight  | double | LoRA权重      | -4.00 \~ +4.00，默认0.8                                                                                                        | 否      |        |

#### 4.2.3 高分辨率修复 hiResFixInfo

| **变量名**                | **格式** | **备注**   | **数值范围**                                                                                                         | **必填** | **示例** |
| ---------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------- | ------ | ------ |
| hiresSteps             | int    | 高清修复采样步数 | 1 \~ 30                                                                                                          | 否      |        |
| hiresDenoisingStrength | double | 高清修复去噪强度 | 0 \~ 1，精确到百分位                                                                                                    | 否      |        |
| upscaler               | int    | 放大算法枚举   | 从提供的[放大算法模型](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-WFWkdGmaCodfMnxwfUvcJH0jn4e)枚举中选择 | 否      |        |
| resizedWidth           | int    | 缩放宽度     | 128 \~ 2048                                                                                                      | 否      |        |
| resizedHeight          | int    | 缩放高度     | 128 \~ 2048                                                                                                      | 否      |        |

#### 4.2.4 图生图基础参数

| **变量名**           | **格式**        | **备注**                 | **数值范围**                                                                                                                    | **必填**    | **示例** |
| ----------------- | ------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------- | ------ |
| templateUuid      | String        | 预设模版uuid               | 从提供的预设参数模版中选择                                                                                                               | 是         |        |
| checkPointId      | String        | 模型uuid                 | 从全网可商用模型和自有模型中选择，[详见文档3.1.1](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-MMThdZJGGowxmXxSmU6cc61FnJd) | 是         |        |
| additionalNetwork | list\[object] | LoRA模型的附加组合及各自参数       | [参考additionalNetwork的参数配置](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#MwsSdFSxnoooIgx2g75cX1Cun0f)         | 否         |        |
| vaeId             | String        | VAE的模型uuid             | [从提供的VAE列表中选择](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-AAM5dG2FToClxPxIsSDct1Lxnqb)               | 否         |        |
| prompt            | string        | 正向提示词，文本               |                                                                                                                             | 是         |        |
| negativePrompt    | string        | 负向提示词，文本               |                                                                                                                             | 是         |        |
| clipSkip          | int           | Clip跳过层                | 1 \~ 12                                                                                                                     | 是         |        |
| sampler           | int           | 采样器枚举值                 | [从采样方法列表中选择](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-JZcOdJYhwooL5RxFp7vc2ZXSn8e)                 | 是         |        |
| steps             | int           | 采样步数                   | 1 \~ 60                                                                                                                     | 是         |        |
| cfgScale          | double        | cfg\_scale             | 1.0 \~ 15.0                                                                                                                 | 是         |        |
| randnSource       | int           | 类型                     |                                                                                                                             | 是         |        |
| seed              | int           | 随机种子                   |                                                                                                                             | 是         |        |
| imgCount          | int           | 单次生图张数                 | 1 \~ 4                                                                                                                      | 是         |        |
| restoreFaces      | int           | *面部修复*                 | 0：关闭，1：开启。默认值0                                                                                                              | 是         |        |
| sourceImage       | string        | 参考图地址                  | 可公网访问的完整URL                                                                                                                 | 是         |        |
| resizeMode        | int           | 缩放模式                   |                                                                                                                             | 是         |        |
| resizedWidth      | int           | 调整后的图片宽度               | 128 \~ 2048                                                                                                                 | 是         |        |
| resizedHeight     | int           | 调整后的图片高度               | 128 \~ 2048                                                                                                                 | 是         |        |
| mode              | int           | 生图模式                   |                                                                                                                             | 是         |        |
| denoisingStrength | double        | 去噪强度（图生图重绘幅度）          | 0 \~ 1。默认值0.75                                                                                                              | 是         |        |
| inpaintParam      | Object        | 蒙版重绘相关参数               | [参考蒙版重绘相关参数配置](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#LO8kdaJsaoEqiZxktCgcvEb2nDe)                     | mode=4时必填 |        |
| controlNet        | list\[Object] | 模型加载的ControlNet组合及各自参数 | [参考controlnet参数配置](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#Q9ordwmTRoa7APxVlaDcDLYnnja)                 | 否         |        |

#### 4.2.5 蒙版重绘相关参数

| **变量名**        | **格式** | **备注**           | **数值范围**      | **必填**    | **示例** |
| -------------- | ------ | ---------------- | ------------- | --------- | ------ |
| maskImage      | string | 蒙版文件地址，只用文件名png  |               | mode=4时必填 |        |
| maskBlur       | int    | 蒙版模糊度            | 0 \~ 64，默认为4  | mode=4时必填 |        |
| maskPadding    | int    | 蒙版边缘预留像素，也称蒙版扩展量 | 0 \~ 256，默认32 | mode=4时必填 |        |
| maskMode       | int    | 蒙版模式             |               | mode=4时必填 |        |
| inpaintArea    | int    | 重绘区域             |               | mode=4时必填 |        |
| inpaintingFill | int    | 蒙版内容的填充模式        |               | mode=4时必填 |        |



### 4.3 生图状态

#### 4.3.1 生图状态（generateStatus）

| 状态枚举值 | 描述   | 备注                                 |
| ----- | ---- | ---------------------------------- |
| 1     | 等待执行 |                                    |
| 2     | 执行中  |                                    |
| 3     | 已生图  |                                    |
| 4     | 审核中  |                                    |
| 5     | 成功   |                                    |
| 6     | 失败   |                                    |
| 7     | 超时   | 任务创建30分钟后没有执行结果就计入timeout状态，并解冻积分。 |

#### 4.3.2 审核状态（auditStatus）

| 状态枚举值 | 描述   | 备注 |
| ----- | ---- | -- |
| 1     | 待审核  |    |
| 2     | 审核中  |    |
| 3     | 审核通过 |    |
| 4     | 审核拦截 |    |
| 5     | 审核失败 |    |

### 4.4  参数模版预设

完整版的生图参数可以满足基础算法F.1、基础算法XL、基础算法1.5下的各类生图任务，但需要非常理解这些参数的含义。

因此除了完整参数的模版以外，我们还提供了一些封装后的参数预设，您可以只提供必要的生图参数，极大简化了配置成本，欢迎体验\~

#### 4.4.1 模版选择（templateUuid）

| **适用方向**  | **模板名称**                                                                                                             | **模板UUID**                       | **备注** |
| --------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------ |
| F.1文生图    | [F.1文生图 - 自定义完整参数](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-M89EdQ0ucoAR6HxyQyecrF98noh)    | 6f7c4652458d4802969f8d089cf5b91f |        |
| F.1图生图    | [F.1图生图 - 自定义完整参数](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-MbQ6dEVDvortZPxaPvOcBQQ9nAh)    | 63b72710c9574457ba303d9d9b8df8bd |        |
| 1.5和XL文生图 | [1.5和XL文生图 - 自定义完整参数](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-T6mBdy2NZo28r7xTXETcDxTEnAg) | e10adc3949ba59abbe56e057f20f883e |        |
| 1.5和XL图生图 | [1.5和XL图生图 - 自定义完整参数](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-OsUddwS7zoIxNvxPM8EcGpUXnkc) | 9c7d531dc75f476aa833b3d452b8f7ad |        |
| 局部重绘      | [Controlnet局部重绘](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-P2seddEU6opN2hxPyZKcfFpPneb)      | b689de89e8c9407a874acd415b3aa126 |        |
| 局部重绘      | [图生图局部重绘](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-MMB4dqZ33odraaxH8m6ckLDhn2f)             | 74509e1b072a4c45a7f1843a963c8462 |        |
| 人物换脸      | [InstantID人像换脸](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-DNLudcOIGoAfpAxmo5wc8FTlnjf)       | 7d888009f81d4252a7c458c874cd017f |        |

#### 4.4.2 模版传参示例

以下提供了调用各类模版时的传参示例，方便您理解不同模版的使用方式。

注：如果要使用如下参数示例生图，请把其中的注释删掉后再使用。

##### F.1文生图 - 自定义完整参数示例

* 接口：POST /api/generate/webui/text2img

##### F.1图生图 - 自定义完整参数示例

* 接口：POST /api/generate/webui/img2img

##### 1.5和XL文生图 - 自定义完整参数示例

* 接口：POST /api/generate/webui/text2img

##### 1.5和XL图生图 - 自定义完整参数示例

* 接口：POST /api/generate/webui/img2img

##### 1.5和XL文生图 - 最简版参数示例

* 接口：POST /api/generate/webui/text2img

##### 1.5和XL图生图 - 最简版参数示例

* 接口：POST /api/generate/webui/img2img

##### 图生图 - 局部重绘参数示例

* 接口：POST /api/generate/webui/img2img

##### Controlnet局部重绘参数示例

* 接口：POST /api/generate/webui/text2img

##### InstantID人像换脸参数示例

* 接口：POST /api/generate/webui/text2img

##### F.1 - PuLID人像换脸参数示例

* 接口：POST /api/generate/webui/text2img

```javascript
{
    "templateUuid": "6f7c4652458d4802969f8d089cf5b91f", // 参数模板ID
    "generateParams": {
        // 基础参数
        "prompt": "filmfotos, Asian portrait,A young woman wearing a green baseball cap,covering one eye with her hand", // 选填
        "steps": 20, // 采样步数
        "width": 768, // 宽
        "height": 1024, // 高
        "imgCount": 1, // 图片数量    
        
        "controlNet": [
            {
                "unitOrder": 0,
                "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/49943c0b-4d79-4e2f-8c55-bc1e5b8c69d8.png",
                "width": 768,
                "height": 1024,
                "preprocessor":0,
                "annotationParameters": {
                    "none": {}
                },
                "model": "405836d1ae2646b4ba2716ed6bd5453a",
                "controlWeight": 1,
                "startingControlStep": 0,
                "endingControlStep": 1,
                "pixelPerfect": 1,
                "controlMode": 0,
                "resizeMode": 1
            }
        ]
    }
}
```

##### F.1 - 风格迁移参数示例

* 接口：POST /api/generate/webui/text2img

```json
{
    "templateUuid": "6f7c4652458d4802969f8d089cf5b91f", // 参数模板ID
    "generateParams": {
        // 基础参数
        "prompt": "The image is a portrait of a young woman with a bouquet of flowers in her hair. She is wearing a white blouse and has a happy expression on her face. The flowers are pink and white daisies with green leaves and stems. The background is a light blue color. The overall mood of the image is dreamy and ethereal.", // 选填
        "steps": 25, // 采样步数
        "width": 768, // 宽
        "height": 1024, // 高
        "imgCount": 1, // 图片数量    
        
        // 风格参考的相关配置
        "controlNet": [
            {
                "unitOrder": 0,
                "sourceImage": "https://liblibai-online.liblib.cloud/img/081e9f07d9bd4c2ba090efde163518f9/a9cf89f2d4bec50d81feb021dd25c505865fbc7b19a3979d76773fcf1f581dee.png",
                "width": 1024,
                "height": 1024,
                "preprocessor": 66,
                "annotationParameters": {
                    "ipAdapterSiglip": {
                        "preprocessorResolution": 1024                                
                    }
                },
                "model": "c6ed70879cf011ef96d600163e37ec70",
                "controlWeight": 0.75, // 控制权重推荐取0.6 ~ 0.75之间
                "startingControlStep": 0,
                "endingControlStep": 1,
                "pixelPerfect": 1,
                "controlMode": 0,
                "resizeMode": 1
            }
        ]
    }
}
```

##### F.1 - 主体参考参数示例

* 接口：POST /api/generate/webui/text2img

## 6. ComfyUI工作流

### 6.1 ComfyUI工作流生图

* 接口：POST  /api/generate/comfyui/app

* headers：



  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数             | 类型     | 是否必需 | 说明                                    | 备注                                                                       |
  | -------------- | ------ | ---- | ------------------------------------- | ------------------------------------------------------------------------ |
  | templateUuid   | string | 否    | 默认模版：4df2efa0f18d46dc9758803e478eb51c |                                                                          |
  | generateParams | object | 是    | 生图参数，json结构前端自动创建该工作流版本的API参数示例       | ![](images/image-76.png)![](images/image-96.png)![](images/image-93.png) |

* 返回值：

  | 参数           | 类型     | 备注                     |
  | ------------ | ------ | ---------------------- |
  | generateUuid | string | 生图任务uuid，使用该uuid查询生图进度 |

* 参数示例

```json
request_body ={
    "templateUuid": "4df2efa0f18d46dc9758803e478eb51c",
    "generateParams": {
        "12": {
            "class_type": "LoadImage",
            "inputs": {
                "image": "https://liblibai-tmp-image.liblib.cloud/img/baf2e419ce1cb06812314957efd2e067/af0c523d3d2b4092ab45c64c72e4deb76babb12e9b8a178eb524143c3b71bf85.png"
            }
        },
        "112": {
            "class_type": "ImageScale",
            "inputs": {
                "width": 768
            }
        },
        "136": {
            "class_type": "RepeatLatentBatch",
            "inputs": {
                "amount": 4
            }
        },
        "137": {
            "class_type": "LatentUpscaleBy",
            "inputs": {
                "scale_by": 1.5
            }
        },
        "workflowUuid": "2f22ab7ce4c044afb6d5eee2e61547f3"
    }
}
```

* 参数说明示例（仅少量节点）

| **节点ID** | **节点类型**             | 节点**名称**  | 参数项     | 参数名称 | **参数说明** |
| -------- | -------------------- | --------- | ------- | ---- | -------- |
| 80       | LoadImage            | 风格图像      | image   | 图像   |          |
| 79       | ApplyIPAdapterFlux   | 风格设置      | weight  | 风格强度 |          |
| 76       | SeargePromptCombiner | 请描述要绘制的画面 | prompt1 | 画面描述 |          |



### 6.2 查询生图结果

* 接口：POST  /api/generate/comfy/status

* headers：

  | header       | value            | 备注 |
  | ------------ | ---------------- | -- |
  | Content-Type | application/json |    |

* 请求body：

  | 参数           | 类型     | 是否必需 | 备注                    |
  | ------------ | ------ | ---- | --------------------- |
  | generateUuid | string | 是    | 生图任务uuid，发起生图任务时返回该字段 |

* 返回值：

| 参数                   | 类型        | 备注                     |
| -------------------- | --------- | ---------------------- |
| generateUuid         | string    | 生图任务uuid，使用该uuid查询生图进度 |
| generateStatus       | int       | 生图任务的执行状态：             |
| percentCompleted     | float     | 生图进度，0到1之间的浮点数，（暂未实现）  |
| generateMsg          | string    | 生图信息，提供附加信息，如生图失败信息    |
| pointsCost           | int       | 本次生图任务消耗积分数            |
| accountBalance       | int       | 账户剩余积分数                |
| images               | \[]object | 图片列表，只提供审核通过的图片        |
| images.0.imageUrl    | string    | 图片地址，可直接访问，地址有时效性：7天   |
| images.0.seed        | int       | 随机种子值                  |
| iamges.0.auditStatus | int       | 审核状态：                  |
| videos               | \[]object | 图片列表，只提供审核通过的图片        |
| videos.0.videoUrl    | string    | 视频列表，只提供审核通过的视频        |
| videos.0.coverPath   | string    | 视频地址，可直接访问，地址有时效性：7天   |
| videos.0.nodeId      | string    | 输出视频的节点ID（可忽略）         |
| videos.0.outputName  | string    | 输出视频的节点名称              |
| videos.0.auditStatus | int       | 审核状态：                  |

示例：

```json
{
        "code": 0,
        "data": {
                "accountBalance": 91111,
                "generateStatus": 5,
                "generateUuid": "a996794faff8424a8ff56acb421e7305",
                "images": [
                        {
                                "auditStatus": 3,
                                "imageUrl": "https://liblibai-tmp-image.liblib.cloud/img/360643a3d8414af8b99664b208bc9302/35801ecbf6e6ea8ad89c2606b68d30dfc9579713f5d917694d1616c57afe82fb.png",
                                "nodeId": "91",
                                "outputName": "SaveImage"
                        }
                ],
                "percentCompleted": 1,
                "pointsCost": 10,
                "videos": []
        },
        "msg": ""
}}
```



### 6.3 部分工作流推荐

全量请至https://www.liblib.art/workflows挑选。

使用以下工作流时，只有inputs中的参数是需要自定义的，其他部分请不要动。

| 功能方向        | 链接                                                                                                                                  | API参数 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 标准版\_按分辨率缩放 | https://www.liblib.art/modelinfo/1bf585fa9ae7455395ee7a595c3920a3?from=personal\_page\&versionUuid=fa2e042e32fa4aabbbacc255b4ab2cca |       |
| 标准版\_按系数放大  | https://www.liblib.art/modelinfo/1bf585fa9ae7455395ee7a595c3920a3?from=personal\_page\&versionUuid=9a1c74ae498640c28e4269958b1a1b15 |       |
| SD放大        | https://www.liblib.art/modelinfo/1bf585fa9ae7455395ee7a595c3920a3?from=personal\_page\&versionUuid=b2c5e10ee73d4cf69a0e51cb1cbc1622 |       |
| 图像外扩        | https://www.liblib.art/modelinfo/ef740b8a4f384db48fcf9f208372493a?from=personal\_page\&versionUuid=99fa146a003743bdb676179fa2e546ca |       |



### 6.4 个人工作流调用方法

需要编辑工作流后发布，务必看完5.4.&#x32;***⚠️⚠️⚠️***

5.4.1 发布本地工作流

个人本地搭建的ComfyUI工作流，需要先在LiblibAI主页右上方发布至平台，可按需选择【自见】，必须选【生成图片可出售或用于商业目的】。

![](images/image-97.png)

![](images/image-95.png)

![](images/image-92.png)



5.4.2 编辑工作&#x6D41;***（⚠️⚠️⚠️易被忽略的步骤）***

编辑方法，详见：[ LiblibAI--AI应用指南](https://liblibai.feishu.cn/wiki/XsvcweApcicdR5k0J3ncKmQMnyf?from=from_lark_group_search)

节点适配范围和调整方式详见：[ ComfyUI FAQ](https://liblibai.feishu.cn/wiki/QGA4wnWMvicnDekUoEFc2ryjn6f?from=from_copylink)

若仍有必需使用的节点，可联系商务：17521599324，电话微信同。

成功编辑好的工作流，会出现“运行应用”的button；若未出现，将无法调用API。

![](images/image-91.png)



5.4.3 发布工作流

我们需要约30秒-20分钟，自动试跑该工作流，试跑完成后，该工作流的详情页将会出现API调用参数，可完成API支持调用。

![](images/image-94.png)



### 6.5 工作流调用费用

每个工作流不同，消耗积分数可以参考API参数详情页左方试跑示范。

![](images/image-90.png)

##

## 7. 生图示例完整demo

我们提供了以下Python脚本用于参考，演示了从发起生图任务到查询生图结果的调用流程，提供了以下接口的使用：

1. &#x20;[星流Star-3 Alpha文生图](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-FE4gdz8HYo8xMUxUoVNc7gwonqg)

2. &#x20;[星流Star-3 Alpha图生图](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-JVttdxrqSoJbBpxOdmJcUDDknch)

3. &#x20;[LiblibAI自定义模型文生图](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-J67hdmfJYoSBGvxo0LeccbbfnOb)

4. &#x20;[LiblibAI自定义模型图生图](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-Q8pKdEK3KouVBxxEubDc7uzvnhf)

5. [查询生图结果](https://liblibai.feishu.cn/wiki/UAMVw67NcifQHukf8fpccgS5n6d#share-DMzxdmvE7oQZh7xz54XcBNllnqe)



* 文生图示例：（含Star-3 Alpha和自定义模型）



* 图生图示例：（含简易模式和进阶模式）





## 8. 错误码汇总

| **错误码** | **错误信息**               | **备注**                                      |
| ------- | ---------------------- | ------------------------------------------- |
| 401     | 签名验证失败                 | /                                           |
| 403     | 访问拒绝                   | 访问拒绝场景包括：                                   |
| 429     | 请求太多，请稍后重试             | QPS超限，发起生图任务接口QPS限制1秒1次                     |
| 100000  | 参数无效                   | 通用参数校验失败                                    |
| 100010  | AccessKey过期            | API商业化权益已过期                                 |
| 100020  | 用户不存在                  | /                                           |
| 100021  | 用户积分不足                 | /                                           |
| 100030  | 图片地址无法访问，或大小超出限制       | 目前图片大小不能大于10M                               |
| 100031  | 图片包含违规内容               | 图片地址无效、无法下载或图片过大                            |
| 100032  | 图片下载失败                 | /                                           |
| 100050  | 生图参数未通过参数完整度校验，请检查参数配置 | 检查模板和Checkpoint和LoRA和Controlnet的匹配关系，需要同一底模 |
| 100051  | 生图任务不存在                | /                                           |
| 100052  | 提示词中包含敏感内容，请修改         | 包括prompt、negativePrompt等提示词参数中包含敏感内容        |
| 100053  | 当前使用的模型不在提供的模型列表内，请检查  | 请从平台提供的Checkpoint、LoRA、VAE、Controlnet列表中选择  |
| 100054  | 当前进行中任务数量已达到并发任务上限     | /                                           |
| 100055  | 生图结果中包含敏感内容，请检查参数配置    | /                                           |
| 100120  | 参数模板不存在                | 传的模板uuid有问题，找不到对应模板                         |
| 200000  | 内部服务错误                 | 具体错误包括：                                     |
| 200001  | 模型不存在                  |                                             |
| 210000  | 调用外部服务失败，请重试           |                                             |

##

## 9. SDK-Java/Js

https://github.com/gravitywp/liblib-java-sdk?tab=readme-ov-file#getting-started

https://github.com/gravitywp/liblib-java-sdk/tree/main/src/main/java/cloud/liblibai/client/examples

https://github.com/gravitywp/liblib-javascript



## 10. 彩蛋

一些AI生图小tips，祝大家玩得愉快～[ 一些AI生图小tips](https://liblibai.feishu.cn/wiki/Oc7iw9awXiffc8kjkQAcqridnNd)

&#x20;
