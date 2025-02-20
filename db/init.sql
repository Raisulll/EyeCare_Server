CREATE TABLE PATIENT (
  PATIENT_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  PATIENT_NAME VARCHAR(255) NOT NULL,
  PATIENT_MAIL VARCHAR(255) NOT NULL UNIQUE,
  PATIENT_PHONE VARCHAR(11) NOT NULL,
  PATIENT_DOB DATE DEFAULT SYSDATE,
  PATIENT_DISTRICT VARCHAR(255) NOT NULL,
  PATIENT_AREA VARCHAR(255) NOT NULL,
  PATIENT_ROADNUMBER VARCHAR(255) NOT NULL,
  PATIENT_GENDER VARCHAR(10),
  PATIENT_PASSWORD VARCHAR(255) NOT NULL,
  PATIENT_IMAGE VARCHAR(255) DEFAULT 'https://res.cloudinary.com/dnn7v3kkw/image/upload/v1727238419/EyeCare/nef8rhqyoovq7wcsodr0.jpg' NOT NULL,
  CONSTRAINT PATIENT_PK PRIMARY KEY (PATIENT_ID),
  CONSTRAINT PATIENT_PHONE_CHECK CHECK (LENGTH(PATIENT_PHONE) = 11)
);

CREATE TABLE DOCTOR (
  DOCTOR_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  DOCTOR_NAME VARCHAR(255) NOT NULL,
  DOCTOR_MAIL VARCHAR(255) NOT NULL UNIQUE,
  DOCTOR_PHONE VARCHAR(11) NOT NULL,
  DOCTOR_DISTRICT VARCHAR(255) NOT NULL,
  DOCTOR_AREA VARCHAR(255) NOT NULL,
  DOCTOR_ROADNUMBER VARCHAR(255) NOT NULL,
  DOCTOR_GENDER VARCHAR(10),
  DOCTOR_LICENSE VARCHAR(255) NOT NULL,
  DOCTOR_TIMESLOT VARCHAR(255) NOT NULL,
  DOCTOR_SPECIALITY VARCHAR(255) NOT NULL,
  DOCTOR_PASSWORD VARCHAR(255) NOT NULL,
  CONSTRAINT DOCTOR_PK PRIMARY KEY (DOCTOR_ID),
  CONSTRAINT DOCTOR_PHONE_CHECK CHECK (LENGTH(DOCTOR_PHONE) = 11)
);

CREATE TABLE APPOINTMENT(
  APPOINTMENT_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  APPOINTMENT_DATE DATE NOT NULL,
  APPOINTMENT_TIME VARCHAR(255) NOT NULL,
  APPOINTMENT_STATUS VARCHAR(255) NOT NULL,
  PATIENT_ID NUMBER NOT NULL,
  DOCTOR_ID NUMBER NOT NULL,
  CONSTRAINT APPOINTMENT_PK PRIMARY KEY (APPOINTMENT_ID),
  CONSTRAINT APPOINTMENT_FK1 FOREIGN KEY (PATIENT_ID) REFERENCES PATIENT(PATIENT_ID) ON DELETE CASCADE,
  CONSTRAINT APPOINTMENT_FK2 FOREIGN KEY (DOCTOR_ID) REFERENCES DOCTOR(DOCTOR_ID) ON DELETE CASCADE
);

CREATE TABLE PRESCRIPTION(
  PRESCRIPTION_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  PRESCRIPTION_DATE DATE NOT NULL,
  PATIENT_ISSUE VARCHAR(255) NOT NULL,
  PRESCRIPTION_DETAILS VARCHAR(255) NOT NULL,
  APPOINTMENT_ID NUMBER NOT NULL,
  CONSTRAINT PRESCRIPTION_PK PRIMARY KEY (PRESCRIPTION_ID),
  CONSTRAINT PRESCRIPTION_FK1 FOREIGN KEY (APPOINTMENT_ID) REFERENCES APPOINTMENT(APPOINTMENT_ID) ON DELETE CASCADE
);

CREATE TABLE OTP(
  OTP_MAIL VARCHAR(255) NOT NULL,
  OTP_CODE VARCHAR(255) NOT NULL,
  OTP_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT OTP_PK PRIMARY KEY (OTP_MAIL)
);

CREATE TABLE SHOP(
  SHOP_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  SHOP_NAME VARCHAR(255) NOT NULL,
  SHOP_MAIL VARCHAR(255) NOT NULL UNIQUE,
  SHOP_PHONE VARCHAR(11) NOT NULL,
  SHOP_DISTRICT VARCHAR(255) NOT NULL,
  SHOP_AREA VARCHAR(255) NOT NULL,
  SHOP_ROADNUMBER VARCHAR(255) NOT NULL,
  SHOP_LICENSE VARCHAR(255) NOT NULL,
  SHOP_PASSWORD VARCHAR(255) NOT NULL,
  CONSTRAINT SHOP_PK PRIMARY KEY (SHOP_ID),
  CONSTRAINT SHOP_PHONE_CHECK CHECK (LENGTH(SHOP_PHONE) = 11)
);

CREATE TABLE SUPPLY (
  PRODUCT_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  PRODUCT_NAME VARCHAR(255) NOT NULL,
  PRODUCT_PRICE NUMBER NOT NULL,
  PRODUCT_DESCRIPTION VARCHAR(255) NOT NULL,
  PRODUCT_IMAGE VARCHAR(255) NOT NULL,
  CONSTRAINT PRODUCT_PK PRIMARY KEY (PRODUCT_ID)
);

CREATE TABLE INVENTORY(
  SHOP_ID NUMBER NOT NULL,
  PRODUCT_ID NUMBER NOT NULL,
  QUANTITY NUMBER NOT NULL,
  CONSTRAINT INVENTORY_PK PRIMARY KEY (SHOP_ID, PRODUCT_ID),
  CONSTRAINT INVENTORY_FK1 FOREIGN KEY (SHOP_ID) REFERENCES SHOP(SHOP_ID) ON DELETE CASCADE,
  CONSTRAINT INVENTORY_FK2 FOREIGN KEY (PRODUCT_ID) REFERENCES SUPPLY(PRODUCT_ID) ON DELETE CASCADE
);

CREATE TABLE HOSPITAL(
  HOSPITAL_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  HOSPITAL_NAME VARCHAR(255) NOT NULL,
  HOSPITAL_MAIL VARCHAR(255) NOT NULL UNIQUE,
  HOSPITAL_PHONE VARCHAR(11) NOT NULL,
  HOSPITAL_DISTRICT VARCHAR(255) NOT NULL,
  HOSPITAL_AREA VARCHAR(255) NOT NULL,
  HOSPITAL_ROADNUMBER VARCHAR(255) NOT NULL,
  HOSPITAL_LICENSE VARCHAR(255) NOT NULL,
  HOSPITAL_PASSWORD VARCHAR(255) NOT NULL,
  CONSTRAINT HOSPITAL_PK PRIMARY KEY (HOSPITAL_ID),
  CONSTRAINT HOSPITAL_PHONE_CHECK CHECK (LENGTH(HOSPITAL_PHONE) = 11)
);

CREATE TABLE CART(
  PATIENT_ID NUMBER NOT NULL,
  PRODUCT_ID NUMBE R NOT NULL,
  SHOP_ID NUMBER NOT NULL,
  CART_QUANTITY NUMBER DEFAULT 0 NOT NULL CONSTRAINT CART_PK PRIMARY KEY (PATIENT_ID, PRODUCT_ID, SHOP_ID),
  CONSTRAINT CART_FK1 FOREIGN KEY (PATIENT_ID) REFERENCES PATIENT(PATIENT_ID) ON DELETE CASCADE,
  CONSTRAINT CART_FK2 FOREIGN KEY (PRODUCT_ID) REFERENCES SUPPLY(PRODUCT_ID) ON DELETE CASCADE,
  CONSTRAINT CART_FK3 FOREIGN KEY (SHOP_ID) REFERENCES SHOP(SHOP_ID) ON DELETE CASCADE
);

CREATE TABLE ORDERS(
  ORDER_ID VARCHAR(255) NOT NULL,
  PATIENT_ID NUMBER NOT NULL,
  ORDER_DATE DATE DEFAULT SYSDATE NOT NULL,
  ORDER_STATUS VARCHAR(255) DEFAULT 'Pending' NOT NULL,
  DELIVERY_AGENCY_ID NUMBER NOT NULL,
  CONSTRAINT ORDERS_PK PRIMARY KEY (ORDER_ID),
  CONSTRAINT ORDERS_FK1 FOREIGN KEY (PATIENT_ID) REFERENCES PATIENT(PATIENT_ID) ON DELETE CASCADE,
  CONSTRAINT ORDERS_FK2 FOREIGN KEY (DELIVERY_AGENCY_ID) REFERENCES DELIVERY_AGENCY(DELIVERY_AGENCY_ID) ON DELETE CASCADE
);

CREATE TABLE ORDERED_PRODUCTS(
  ORDER_ID NUMBER NOT NULL,
  PRODUCT_ID NUMBER NOT NULL,
  SHOP_ID NUMBER NOT NULL,
  ORDER_QUANTITY NUMBER NOT NULL,
  CONSTRAINT ORDERED_PRODUCTS_PK PRIMARY KEY (ORDER_ID, PRODUCT_ID, SHOP_ID),
  CONSTRAINT ORDERED_PRODUCTS_FK1 FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID) ON DELETE CASCADE,
  CONSTRAINT ORDERED_PRODUCTS_FK2 FOREIGN KEY (PRODUCT_ID) REFERENCES SUPPLY(PRODUCT_ID) ON DELETE CASCADE,
  CONSTRAINT ORDERED_PRODUCTS_FK3 FOREIGN KEY (SHOP_ID) REFERENCES SHOP(SHOP_ID) ON DELETE CASCADE
);

CREATE TABLE DELIVERY_AGENCY(
  DELIVERY_AGENCY_ID NUMBER GENERATED BY DEFAULT AS IDENTITY,
  DELIVERY_AGENCY_NAME VARCHAR(255) NOT NULL,
  DELIVERY_AGENCY_PHONE VARCHAR(11) NOT NULL,
  DELIVERY_AGENCY_EMAIL VARCHAR(255) NOT NULL,
  DELIVERY_CHARGE NUMBER DEFAULT 0 NOT NULL,
  DELIVERY_AGENCY_DISTRICT VARCHAR(255) NOT NULL,
  DELIVERY_AGENCY_AREA VARCHAR(255) NOT NULL,
  DELIVERY_AGENCY_ROADNUMBER VARCHAR(255) NOT NULL,
  DELIVERY_AGENCY_LICENSE VARCHAR(255) NOT NULL,
  DELIVERY_AGENCY_STATUS VARCHAR(255) NOT NULL,
  DELIVERY_AGENCY_PASSWORD VARCHAR(255) NOT NULL,
  CONSTRAINT DELIVERY_AGENCY_PK PRIMARY KEY (DELIVERY_AGENCY_ID),
  CONSTRAINT DELIVERY_AGENCY_PHONE_CHECK CHECK (LENGTH(DELIVERY_AGENCY_PHONE) = 11)
);

CREATE TABLE TRANSACTION ( 
  TRANSACTION_ID NUMBER GENERATED BY DEFAULT AS IDENTITY, 
  TRANSACTION_DATE DATE NOT NULL, 
  TRANSACTION_AMOUNT NUMBER NOT NULL, 
  PATIENT_ID NUMBER NOT NULL, 
  SHOP_ID NUMBER, 
  HOSPITAL_ID NUMBER, 
  DOCTOR_ID NUMBER, 
  CONSTRAINT TRANSACTION_PK PRIMARY KEY (TRANSACTION_ID), 
  CONSTRAINT TRANSACTION_FK1 FOREIGN KEY (PATIENT_ID) REFERENCES PATIENT(PATIENT_ID) );

  ALTER TABLE TRANSACTION ADD TRANSACTION_FOR VARCHAR(
    255
  ) DEFAULT 'Doctors fee' NOT NULL;

-------------------------function for calculating age-----------------
CREATE OR REPLACE FUNCTION CALCULATE_AGE(
  DOB DATE
) RETURN NUMBER DETERMINISTIC IS
BEGIN
  RETURN FLOOR(MONTHS_BETWEEN(TRUNC(SYSDATE), DOB) / 12);
END;
 

------------------virual column for calculating age-------------------------
ALTER TABLE PATIENT
  ADD PATIENT_AGE AS (
    CALCULATE_AGE(PATIENT_DOB)
  );
  
---------------sequene on order table ----------------
CREATE SEQUENCE ORDER_ID_SEQ START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 1000000 NOCYCLE;

---------------------------trigger for inserting into order table --------------------

CREATE OR REPLACE TRIGGER 
BEFORE INSERT ON ORDERS
FOR EACH ROW
BEGIN
  SELECT 'ORD' || TO_CHAR(ORDER_ID_SEQ.NEXTVAL, 'FM0000000') 
  INTO :NEW.ORDER_ID
  FROM DUAL;
END;


-----------------------------Abstract data type for patient address---------------------
CREATE OR REPLACE TYPE address_type AS OBJECT(
  PATIENT_DISTRICT VARCHAR(255),
  PATIENT_AREA VARCHAR(255),
  PATIENT_ROADNUMBER VARCHAR(255)
);


CREATE TABLE SURGERY(
  SURGERY_ID NUMBER,
  SURGERY_NAME VARCHAR(255) NOT NULL,
  SURGERY_DATE DATE NOT NULL,
  SURGERY_TIME VARCHAR(255) NOT NULL,
  SURGERY_STATUS VARCHAR(255) NOT NULL,
  PATIENT_ID NUMBER NOT NULL,
  DOCTOR_ID NUMBER NOT NULL,
  HOSPITAL_ID NUMBER NOT NULL,
  CONSTRAINT SURGERY_PK PRIMARY KEY (SURGERY_ID),
  CONSTRAINT SURGERY_FK1 FOREIGN KEY (PATIENT_ID) REFERENCES PATIENT(PATIENT_ID) ON DELETE CASCADE,
  CONSTRAINT SURGERY_FK2 FOREIGN KEY (DOCTOR_ID) REFERENCES DOCTOR(DOCTOR_ID) ON DELETE CASCADE,
  CONSTRAINT SURGERY_FK3 FOREIGN KEY (HOSPITAL_ID) REFERENCES HOSPITAL(HOSPITAL_ID) ON DELETE CASCADE
)


--------------------------------------------------------------
---dynamic search for PRODUCT
//search products

ROUTER.GET("/productsearch", ASYNC (REQ, RES) => {
CONST SEARCH = REQ.QUERY.SEARCH;

CONSOLE.LOG(SEARCH);

TRY {
CONST PRODUCTS = AWAIT RUN_QUERY(
`SELECT I.PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_IMAGE, QUANTITY, SH.SHOP_ID, SH.SHOP_NAME
FROM SUPPLY S, INVENTORY I, SHOP SH
WHERE

I.SHOP_ID = SH.SHOP_ID AND

S.PRODUCT_ID = I.PRODUCT_ID AND
QUANTITY > 0 AND
LOWER(PRODUCT_NAME) LIKE '%${search}%'`,
{}
);

CONSOLE.LOG(PRODUCTS);

RES.STATUS(200).JSON(PRODUCTS);

} CATCH (ERROR) {

// console.log(error);

RES.STATUS(500).JSON({ MESSAGE: "Internal Server Error" });

}
});

---------------Complex query-----------------------
----using join-------------
SELECT
  D.DOCTOR_NAME,
  D.DOCTOR_MAIL,
  D.DOCTOR_PHONE,
  D.DOCTOR_DISTRICT,
  D.DOCTOR_AREA,
  D.DOCTOR_ROADNUMBER,
  D.DOCTOR_IMAGE,
  D.DOCTOR_SPECIALITY,
  D.DOCTOR_PAYMENT,
  D.DOCTOR_TIMESLOT,
  H.HOSPITAL_NAME
FROM
  DOCTOR   D
  JOIN HOSPITAL H
  ON D.HOSPITAL_ID = H.HOSPITAL_ID
WHERE
  D.DOCTOR_ID = ${DOCTORID};




SELECT
  I.PRODUCT_ID,
  PRODUCT_NAME,
  PRODUCT_DESCRIPTION,
  PRODUCT_PRICE,
  PRODUCT_IMAGE,
  QUANTITY,
  SH.SHOP_ID,
  SH.SHOP_NAME
FROM
  SUPPLY    S,
  INVENTORY I,
  SHOP      SH
WHERE
  I.SHOP_ID = SH.SHOP_ID
  AND S.PRODUCT_ID = I.PRODUCT_ID
  AND QUANTITY > 0;




SELECT
  I.PRODUCT_ID,
  PRODUCT_NAME,
  PRODUCT_DESCRIPTION,
  PRODUCT_PRICE,
  PRODUCT_IMAGE,
  QUANTITY,
  SH.SHOP_ID,
  SH.SHOP_NAME
FROM
  SUPPLY S,
  INVENTORY I,
  SHOP SH
WHERE
  I.SHOP_ID = SH.SHOP_ID
  AND S.PRODUCT_ID = I.PRODUCT_ID
  AND QUANTITY > 0
  AND LOWER(PRODUCT_NAME) LIKE '%${search}%';




SELECT
  PRODUCT_NAME,
  PRODUCT_PRICE,
  C.PRODUCT_ID,
  QUANTITY,
  CART_QUANTITY,
  PRODUCT_IMAGE,
  SHOP_NAME,
  SH.SHOP_ID
FROM
  CART C,
  SUPPLY S,
  INVENTORY I,
  SHOP SH
WHERE
  C.PRODUCT_ID = S.PRODUCT_ID
  AND S.PRODUCT_ID = I.PRODUCT_ID
  AND C.SHOP_ID = I.SHOP_ID
  AND C.SHOP_ID = SH.SHOP_ID
  AND C.PATIENT_ID=${PATIENTID};



  SELECT
  O.ORDER_ID,
  PRODUCT_NAME,
  ORDER_QUANTITY,
  PATIENT_NAME,
  ORDER_DATE,
  DELIVERY_AGENCY_NAME
FROM
  ORDERS O,
  ORDERED_PRODUCTS OP,
  SUPPLY S,
  PATIENT P,
  DELIVERY_AGENCY D
WHERE
  O.ORDER_ID = OP.ORDER_ID
  AND OP.PRODUCT_ID = S.PRODUCT_ID
  AND O.PATIENT_ID = P.PATIENT_ID
  AND SHOP_ID = ${SHOPID}
  AND ORDER_STATUS = 'Pending'
  AND O.DELIVERY_AGENCY_ID=D.DELIVERY_AGENCY_ID;


  SELECT
  O.ORDER_ID,
  ORDER_DATE,
  SHOP_NAME,
  PRODUCT_NAME,
  ORDER_QUANTITY,
  D.DELIVERY_AGENCY_NAME
FROM
  ORDERS O,
  ORDERED_PRODUCTS OP,
  SHOP S,
  SUPPLY SU,
  DELIVERY_AGENCY D
WHERE
  O.ORDER_ID = OP.ORDER_ID
  AND OP.PRODUCT_ID = SU.PRODUCT_ID
  AND OP.SHOP_ID = S.SHOP_ID
  AND O.PATIENT_ID = ${PATIENTID}
  AND O.ORDER_STATUS = 'Delivered'
  AND O.DELIVERY_AGENCY_ID = D.DELIVERY_AGENCY_ID;

  SELECT
  O.ORDER_ID,
  ORDER_DATE,
  SHOP_NAME,
  PRODUCT_NAME,
  ORDER_QUANTITY,
  D.DELIVERY_AGENCY_NAME
FROM
  ORDERS O,
  ORDERED_PRODUCTS OP,
  SHOP S,
  SUPPLY SU,
  DELIVERY_AGENCY D
WHERE
  O.ORDER_ID = OP.ORDER_ID
  AND OP.PRODUCT_ID = SU.PRODUCT_ID
  AND OP.SHOP_ID = S.SHOP_ID
  AND O.PATIENT_ID = ${PATIENTID}
  AND O.ORDER_STATUS = 'Accepted'
  AND O.DELIVERY_AGENCY_ID = D.DELIVERY_AGENCY_ID;

  SELECT
  O.ORDER_ID,
  ORDER_DATE,
  SHOP_NAME,
  PRODUCT_NAME,
  ORDER_QUANTITY,
  PATIENT_NAME,
  PATIENT_PHONE,
  PATIENT_ADDRESS
FROM
  ORDERS O,
  ORDERED_PRODUCTS OP,
  SHOP S,
  SUPPLY SU,
  PATIENT P
WHERE
  O.ORDER_ID = OP.ORDER_ID
  AND OP.PRODUCT_ID = SU.PRODUCT_ID
  AND OP.SHOP_ID = S.SHOP_ID
  AND O.DELIVERY_AGENCY_ID = ${DELIVERYID}
  AND O.ORDER_STATUS = 'Accepted'
  AND O.PATIENT_ID = P.PATIENT_ID


  --------------------------------------------subquery--------------------------------
  INSERT INTO PRESCRIPTION(
  PRESCRIPTION_DATE,
  APPOINTMENT_ID,
  PATIENT_ISSUE,
  MEDICINE,
  GLASS,
  SURGERY
) VALUES (
  (SELECT APPOINTMENT_DATE FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID),
  :APPOINTMENTID,
  :PATIENTISSUE,
  :MEDICINE,
  :GLASSDETAILS,
  :SURGERYDETAILS
);



INSERT INTO TRANSACTION (
  TRANSACTION_DATE,
  TRANSACTION_AMOUNT,
  PATIENT_ID,
  DOCTOR_ID,
  PAYMENT_TO
) VALUES (
  (SELECT APPOINTMENT_DATE FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID),
  (SELECT DOCTOR_PAYMENT FROM DOCTOR WHERE DOCTOR_ID = (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID)),
  (SELECT PATIENT_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID),
  (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID),
  (SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID = (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID))
);


INSERT INTO ORDERED_PRODUCTS(
  ORDER_ID,
  PRODUCT_ID,
  SHOP_ID,
  ORDER_QUANTITY,
  ORDER_PRICE
) VALUES(
  (SELECT MAX(ORDER_ID) FROM ORDERS),
  :PRODUCTID,
  :SHOPID,
  :ORDERQUANTITY,
  (SELECT PRODUCT_PRICE FROM SUPPLY WHERE PRODUCT_ID = :PRODUCTID)*:ORDERQUANTITY
);

INSERT INTO TRANSACTION(
  TRANSACTION_DATE,
  TRANSACTION_AMOUNT,
  PATIENT_ID,
  DELIVERY_AGENCY_ID,
  PAYMENT_TO
) VALUES(
  SELECT
    ORDER_DATE
  FROM
    ORDERS
  WHERE
    ORDER_ID = :ORDERID,
    SELECT
      DELIVERY_CHARGE
    FROM
      DELIVERY_AGENCY
    WHERE
      DELIVERY_AGENCY_ID = (
        SELECT
          DELIVERY_AGENCY_ID
        FROM
          ORDERS
        WHERE
          ORDER_ID = :ORDERID
      ),
      SELECT
        PATIENT_ID
      FROM
        ORDERS
      WHERE
        ORDER_ID = :ORDERID,
        SELECT
          DELIVERY_AGENCY_ID
        FROM
          ORDERS
        WHERE
          ORDER_ID = :ORDERID,
          SELECT
            DELIVERY_AGENCY_NAME
          FROM
            DELIVERY_AGENCY
          WHERE
            DELIVERY_AGENCY_ID = (
              SELECT
                DELIVERY_AGENCY_ID
              FROM
                ORDERS
              WHERE
                ORDER_ID = :ORDERID
            )
);



INSERT INTO SURGERY (
  SURGERY_ID,
  SURGERY_NAME,
  SURGERY_DATE,
  SURGERY_TIME,
  SURGERY_STATUS,
  PATIENT_ID,
  DOCTOR_ID,
  HOSPITAL_ID
) VALUES (
  SURGERY_ID_SEQ.NEXTVAL,
  :SURGERYNAME,
  TO_DATE(:SURGERYDATE, 'YYYY-MM-DD'),
  :SURGERYTIME,
  :SURGERYSTATUS,
  (SELECT PATIENT_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID),
  (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID),
  (SELECT HOSPITAL_ID FROM DOCTOR WHERE DOCTOR_ID = (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :APPOINTMENTID))
);


