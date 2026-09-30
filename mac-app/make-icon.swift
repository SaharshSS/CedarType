import AppKit
import Foundation

let outputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let size = 1024
let image = NSImage(size: NSSize(width: size, height: size))
image.lockFocus()
guard let context = NSGraphicsContext.current?.cgContext else {
    fatalError("Could not create icon drawing context")
}
context.setAllowsAntialiasing(true)
context.setShouldAntialias(true)
// Work in top-left coordinates so the cedar's crown naturally points upward.
context.translateBy(x: 0, y: CGFloat(size))
context.scaleBy(x: 1, y: -1)

let forest = NSColor(calibratedRed: 0.12, green: 0.29, blue: 0.23, alpha: 1).cgColor
let cream = NSColor(calibratedRed: 0.97, green: 0.94, blue: 0.86, alpha: 1).cgColor
let sage = NSColor(calibratedRed: 0.69, green: 0.79, blue: 0.67, alpha: 1).cgColor
let bounds = CGRect(x: 0, y: 0, width: size, height: size)

context.addPath(CGPath(roundedRect: bounds.insetBy(dx: 12, dy: 12), cornerWidth: 220, cornerHeight: 220, transform: nil))
context.setFillColor(cream)
context.fillPath()

// One clear speech-bubble silhouette surrounds a compact, upright cedar mark.
let bubble = CGMutablePath()
bubble.move(to: CGPoint(x: 290, y: 145))
bubble.addLine(to: CGPoint(x: 734, y: 145))
bubble.addCurve(to: CGPoint(x: 884, y: 295), control1: CGPoint(x: 884, y: 145), control2: CGPoint(x: 884, y: 212))
bubble.addLine(to: CGPoint(x: 884, y: 625))
bubble.addCurve(to: CGPoint(x: 734, y: 775), control1: CGPoint(x: 884, y: 708), control2: CGPoint(x: 817, y: 775))
bubble.addLine(to: CGPoint(x: 405, y: 775))
bubble.addLine(to: CGPoint(x: 238, y: 895))
bubble.addLine(to: CGPoint(x: 286, y: 775))
bubble.addCurve(to: CGPoint(x: 140, y: 625), control1: CGPoint(x: 205, y: 775), control2: CGPoint(x: 140, y: 708))
bubble.addLine(to: CGPoint(x: 140, y: 295))
bubble.addCurve(to: CGPoint(x: 290, y: 145), control1: CGPoint(x: 140, y: 212), control2: CGPoint(x: 207, y: 145))
bubble.closeSubpath()
context.addPath(bubble)
context.setFillColor(forest)
context.fillPath()
context.addPath(bubble)
context.setStrokeColor(sage)
context.setLineWidth(10)
context.strokePath()

let tree = CGMutablePath()
tree.move(to: CGPoint(x: 512, y: 232))
tree.addLine(to: CGPoint(x: 402, y: 378))
tree.addLine(to: CGPoint(x: 457, y: 378))
tree.addLine(to: CGPoint(x: 344, y: 505))
tree.addLine(to: CGPoint(x: 412, y: 505))
tree.addLine(to: CGPoint(x: 280, y: 646))
tree.addLine(to: CGPoint(x: 448, y: 646))
tree.addLine(to: CGPoint(x: 448, y: 738))
tree.addLine(to: CGPoint(x: 576, y: 738))
tree.addLine(to: CGPoint(x: 576, y: 646))
tree.addLine(to: CGPoint(x: 744, y: 646))
tree.addLine(to: CGPoint(x: 612, y: 505))
tree.addLine(to: CGPoint(x: 680, y: 505))
tree.addLine(to: CGPoint(x: 567, y: 378))
tree.addLine(to: CGPoint(x: 622, y: 378))
tree.closeSubpath()
context.addPath(tree)
context.setFillColor(cream)
context.fillPath()

image.unlockFocus()
guard let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let png = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("Could not encode icon")
}
try png.write(to: outputURL)
