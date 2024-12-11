import { fabric } from 'fabric'

interface TransformPoint {
  x: number
  y: number
}

interface TransformSize {
  width: number
  height: number
}

export const transformUtils = {
  /**
   * 将实际坐标转换为画布坐标
   */
  toCanvasPoint(canvas: fabric.Canvas, point: TransformPoint): TransformPoint {
    const zoom = canvas.getZoom()
    const vpt = canvas.viewportTransform
    if (!vpt) return point

    return {
      x: point.x / zoom - vpt[4] / zoom,
      y: point.y / zoom - vpt[5] / zoom
    }
  },

  /**
   * 将实际尺寸转换为画布尺寸
   */
  toCanvasSize(canvas: fabric.Canvas, size: TransformSize): TransformSize {
    const zoom = canvas.getZoom()
    return {
      width: size.width / zoom,
      height: size.height / zoom
    }
  },

  /**
   * 获取考虑画布变换的对象边界
   */
  getTransformedBounds(canvas: fabric.Canvas, obj: fabric.Object) {
    return obj.getBoundingRect(true, true)
  },

  /**
   * 调整属性值以适应画布缩放
   */
  scaleValue(canvas: fabric.Canvas, value: number): number {
    return value / canvas.getZoom()
  },

  /**
   * 创建考虑画布变换的矩形配置
   */
  createRectConfig(canvas: fabric.Canvas, bounds: TransformPoint & TransformSize, options: Partial<fabric.IRectOptions> = {}) {
    const transformedPoint = this.toCanvasPoint(canvas, bounds)
    const transformedSize = this.toCanvasSize(canvas, bounds)
    const zoom = canvas.getZoom()

    return {
      left: transformedPoint.x,
      top: transformedPoint.y,
      width: transformedSize.width,
      height: transformedSize.height,
      strokeWidth: (options.strokeWidth || 1) / zoom,
      cornerSize: (options.cornerSize || 10) / zoom,
      ...options
    }
  },

  /**
   * 计算考虑缩放的padding值
   */
  getScaledPadding(canvas: fabric.Canvas, padding: number): number {
    const zoom = canvas.getZoom()
    return padding * zoom
  },

  /**
   * 获取画布变换信息
   */
  getCanvasTransform(canvas: fabric.Canvas) {
    const zoom = canvas.getZoom()
    const vpt = canvas.viewportTransform
    if (!vpt) return { zoom, translateX: 0, translateY: 0 }
    
    return {
      zoom,
      translateX: vpt[4],
      translateY: vpt[5]
    }
  },

  /**
   * 创建考虑画布变换的扩展框配置
   */
  createExpandBoxConfig(canvas: fabric.Canvas, bounds: { left: number; top: number; width: number; height: number }, padding: number, options: Partial<fabric.IRectOptions> = {}) {
    const { zoom } = this.getCanvasTransform(canvas)
    // 不对padding进行缩放，保持固定的视觉大小
    const scaledPadding = padding

    return {
      left: bounds.left - scaledPadding,
      top: bounds.top - scaledPadding,
      width: bounds.width + scaledPadding * 2,
      height: bounds.height + scaledPadding * 2,
      strokeWidth: options.strokeWidth || 2,
      cornerSize: options.cornerSize || 10,
      ...options
    }
  }
} 
