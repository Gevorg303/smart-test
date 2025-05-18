package com.example.smart_test.request;

import com.example.smart_test.dto.IndicatorDto;
import lombok.Data;

@Data
public class EditingIndicatorRequest {
    private IndicatorDto indicator;
    private boolean isDeleted;

    public EditingIndicatorRequest(IndicatorDto indicator, boolean isDeleted) {
        this.indicator = indicator;
        this.isDeleted = isDeleted;
    }
}
