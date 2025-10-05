import React from 'react'
import { Shield, Lock, Eye, Database, UserCheck, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrivacyPolicyProps {
  onAccept?: () => void
  onDecline?: () => void
  isModal?: boolean
}

export function PrivacyPolicy({ onAccept, onDecline, isModal = false }: PrivacyPolicyProps) {
  const containerClass = isModal 
    ? "max-w-4xl mx-auto bg-white rounded-lg p-8" 
    : "wabi-container py-16"

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-light text-stone-900 mb-4">
          隐私政策
        </h1>
        <p className="text-stone-600 text-lg font-light max-w-2xl mx-auto">
          我们承诺保护您的个人信息和隐私权益
        </p>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <span className="text-sm text-stone-500">最后更新：2025年1月16日</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
          <span className="text-sm text-green-600 font-medium">GDPR 兼容</span>
        </div>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 bg-stone-50 rounded-lg">
          <Lock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          <h3 className="font-medium text-stone-900 mb-2">数据安全</h3>
          <p className="text-sm text-stone-600">
            使用行业领先的加密技术保护您的数据
          </p>
        </div>
        
        <div className="text-center p-6 bg-stone-50 rounded-lg">
          <Eye className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <h3 className="font-medium text-stone-900 mb-2">透明度</h3>
          <p className="text-sm text-stone-600">
            清晰告知您我们如何收集和使用您的信息
          </p>
        </div>
        
        <div className="text-center p-6 bg-stone-50 rounded-lg">
          <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-4" />
          <h3 className="font-medium text-stone-900 mb-2">用户控制</h3>
          <p className="text-sm text-stone-600">
            您可以随时管理、更新或删除您的数据
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Data Collection */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-4">
            1. 数据收集
          </h2>
          <div className="space-y-4 text-stone-700">
            <h3 className="text-lg font-medium">我们收集的信息类型：</h3>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>基本信息：</strong>姓名、邮箱地址、出生日期、性别</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>皮肤分析数据：</strong>上传的照片、AI分析结果</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>使用数据：</strong>浏览记录、应用使用情况</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>位置信息：</strong>用于天气相关的护肤建议（可选）</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Usage */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-4">
            2. 数据使用
          </h2>
          <div className="space-y-4 text-stone-700">
            <p>我们使用您的信息用于：</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span>提供个性化的皮肤分析和建议</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span>改进我们的AI算法和服务质量</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span>发送相关的产品建议和更新通知</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span>统计分析和研究目的（匿名化处理）</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-4">
            3. 数据安全
          </h2>
          <div className="space-y-4 text-stone-700">
            <p>我们采取以下安全措施保护您的数据：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">加密保护</h4>
                <p className="text-sm">所有数据传输和存储都使用高级加密技术</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">访问控制</h4>
                <p className="text-sm">严格限制数据访问权限，只有授权人员可以访问</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">定期备份</h4>
                <p className="text-sm">定期备份数据，防止数据丢失</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">安全监控</h4>
                <p className="text-sm">24/7监控系统安全，及时发现并处理威胁</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-4">
            4. 您的权益
          </h2>
          <div className="space-y-4 text-stone-700">
            <p>根据GDPR和其他隐私法规，您享有以下权益：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">知情权</h4>
                  <p className="text-sm">了解我们如何处理您的个人数据</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">访问权</h4>
                  <p className="text-sm">获取我们持有的您的个人数据副本</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">更正权</h4>
                  <p className="text-sm">要求更正不准确或不完整的个人数据</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">删除权</h4>
                  <p className="text-sm">要求删除您的个人数据</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-4">
            5. 联系我们
          </h2>
          <div className="bg-stone-50 rounded-lg p-6">
            <p className="text-stone-700 mb-4">
              如果您对我们的隐私政策有任何疑问或希望行使您的权益，请联系我们：
            </p>
            <div className="space-y-2 text-sm text-stone-600">
              <p><strong>邮箱：</strong> privacy@dermaeco.com</p>
              <p><strong>地址：</strong> 上海市黄浦区世纪大道100号</p>
              <p><strong>电话：</strong> +86 21 1234 5678</p>
            </div>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      {isModal && (onAccept || onDecline) && (
        <div className="flex items-center justify-end space-x-4 mt-12 pt-6 border-t border-stone-200">
          {onDecline && (
            <Button
              onClick={onDecline}
              variant="outline"
              className="px-8"
            >
              拒绝
            </Button>
          )}
          {onAccept && (
            <Button
              onClick={onAccept}
              className="bg-black text-white hover:bg-stone-800 px-8"
            >
              接受
            </Button>
          )}
        </div>
      )}
    </div>
  )
}