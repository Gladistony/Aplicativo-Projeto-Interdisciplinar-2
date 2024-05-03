import cv2 # type: ignore
import mediapipe as mp # type: ignore

video = cv2.VideoCapture(0)

hand = mp.solutions.hands
Hand = hand.Hands(max_num_hands=1)
mpDraw = mp.solutions.drawing_utils

while True:
    check,img = video.read()
    imgRGB = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    result = Hand.process(imgRGB)
    handsPoints = result.multi_hand_landmarks
    h,w,_= img.shape
    pontos = []
    if handsPoints:
        for points in handsPoints:
            mpDraw.draw_landmarks(img,points,hand.HAND_CONNECTIONS)
            for id,cord in enumerate(points.landmark):
                cx,cy = int(cord.x*w),int(cord.y*h)
                #cv2.putText(img,str(id),(cx,cy+10),cv2.FONT_HERSHEY_SIMPLEX,0.5,(255,0,0),2)
                pontos.append((cx,cy))
        dedos = [8,12,16,20]
        contador = 0

        if points:
            # dedão
            if pontos[4][0] < pontos[2][0]:
                contador += 1
            for x in dedos:
                # 4 dedos
                if pontos[x][1] < pontos[x-2][1]:
                    contador += 1
                    print("Dedo Aberto")
        cv2.putText(img,str(contador),(100,100),cv2.FONT_HERSHEY_SIMPLEX,4,(255,0,0),5)

    cv2.imshow("Image",img)
    cv2.waitKey(1)