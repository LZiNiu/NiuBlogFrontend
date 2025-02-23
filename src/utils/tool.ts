// 防抖函数
export function debounce(func: Function, wait: number) {
    let timeout: number | undefined; // 用于存储定时器

    return function (this: any, ...args: any[]) {
        const context = this; // 保存当前的 this 上下文

        // 如果已经有定时器，则清除之前的定时器
        if (timeout) {
            clearTimeout(timeout);
        }

        // 设置新的定时器
        timeout = setTimeout(() => {
            func.apply(context, args); // 执行函数
        }, wait);
    };
}