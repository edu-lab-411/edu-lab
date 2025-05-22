package com.wessacademy.server2.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "favorites")
@Data
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Favorite implements java.io.Serializable {
    @Id
    private String id;
    private int userId;
    private int courseId;
}