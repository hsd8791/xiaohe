###不可配置项
  新用户审核流程提醒
  注册页面(暂时不需要了...)
  联系方式等文案

###静态文件
  定制样式（定制scss 文件，批量sass 后静态上传）  
  定制icon（动态引入）



  if(this.loanInfo){
    this.loanInfo.canReborrow=this.loanInfo.repaymentTime+604800000>(new Date()).getTime()
  }