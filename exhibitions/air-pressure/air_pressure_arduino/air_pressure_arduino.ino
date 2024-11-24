#include "Pressure.h"

Pressure P1(A0, MPX5010, 4.75);
void setup() {
  // put your setup code here, to run once:
  P1.Init();
  Serial.begin(9600);
}

void loop() {
  Serial.println(P1.Get(KPA));
  delay(300);
}