export interface IBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FaceDetector = {
  SSD_MOBILENETV1: 'ssd_mobilenetv1',
  TINY_FACE_DETECTOR: 'tiny_face_detector',
  MTCNN: 'mtcnn',
};

export const FaceExpression = {
  NEUTRAL: 'neutral',
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  FEARFUL: 'fearful',
  DISGUSTED: 'disgusted',
  SURPRISED: 'surprised',
};
