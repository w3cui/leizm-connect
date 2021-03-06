import { ServerResponse } from "http";
import { Context } from "./context";

export class Response {
  constructor(
    public readonly res: ServerResponse,
    public readonly ctx: Context
  ) {}

  /**
   * 初始化完成
   */
  public inited() {}

  /**
   * 设置响应状态码
   *
   * @param statusCode 响应状态码
   */
  public setStatus(statusCode: number): this {
    this.res.statusCode = statusCode;
    return this;
  }

  /**
   * 获取响应头
   *
   * @param name 名称
   */
  public getHeader(name: string): string | string[] | number {
    return this.res.getHeader(name);
  }

  /**
   * 获取所有响应头
   *
   * @param name 名称
   */
  public getHeaders(): Record<string, string | string[] | number> {
    return (
      (this.res.getHeaders
        ? this.res.getHeaders()
        : (this.res as any)._headers) || {}
    );
  }

  /**
   * 设置响应头
   *
   * @param name 名称
   * @param value 值
   */
  public setHeader(name: string, value: string | string[] | number): this {
    this.res.setHeader(name, value);
    return this;
  }

  /**
   * 添加响应头
   *
   * @param name 名称
   * @param value 值
   */
  public appendHeader(name: string, value: string | string[] | number): this {
    let header = this.getHeader(name) as any[];
    if (!header) {
      header = [];
    } else if (!Array.isArray(header)) {
      header = [header];
    }
    if (Array.isArray(value)) {
      header = header.concat(value);
    } else {
      header.push(value);
    }
    this.setHeader(name, header);
    return this;
  }

  /**
   * 设置响应头
   *
   * @param headers 响应头
   */
  public setHeaders(headers: Record<string, string | string[] | number>): this {
    for (const name in headers) {
      this.setHeader(name, headers[name]);
    }
    return this;
  }

  /**
   * 删除响应头
   *
   * @param name 名称
   */
  public removeHeader(name: string): this {
    this.res.removeHeader(name);
    return this;
  }

  /**
   * 写响应头
   *
   * @param statusCode 响应状态码
   * @param headers 响应头
   */
  public writeHead(
    statusCode: number,
    headers: Record<string, string | string[] | number>
  ): this {
    this.res.writeHead(statusCode, headers);
    return this;
  }

  /**
   * 输出数据
   *
   * @param data 要输出的数据
   * @param encoding 字符编码
   * @param callback 回调函数
   */
  public write(
    data: string | Buffer | Uint8Array,
    encoding?: string,
    callback?: () => void
  ): boolean {
    return this.res.write.apply(this.res, arguments);
  }

  /**
   * 输出数据并结束
   *
   * @param data 要输出的数据
   * @param encoding 字符编码
   * @param callback 回调函数
   */
  public end(
    data: string | Buffer | Uint8Array,
    encoding?: string,
    callback?: () => void
  ): boolean {
    return this.res.end.apply(this.res, arguments);
  }

  /**
   * 响应JSON
   * @param data 数据
   */
  public json(data: any): void {
    this.setHeader("Content-Type", "application/json");
    this.end(JSON.stringify(data));
  }

  /**
   * 响应HTML页面
   * @param str 内容
   */
  public html(str: Buffer | string): void {
    this.setHeader("Content-Type", "text/html");
    this.end(str);
  }
}
